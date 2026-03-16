// Copyright 2024 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ConfidentialTransferClient } from "@fairblock/stabletrust";
import { Wallet, JsonRpcProvider, BrowserProvider } from "ethers";
import ConfidentialProtocol from "./confidential-protocol.js";

/** @typedef {import('@tetherto/wdk-wallet-evm').WalletAccountReadOnlyEvm} WalletAccountReadOnlyEvm */
/** @typedef {import('./confidential-protocol.js').EnableConfidentialityOptions} EnableConfidentialityOptions */
/** @typedef {import('./confidential-protocol.js').DepositConfidentialOptions} DepositConfidentialOptions */
/** @typedef {import('./confidential-protocol.js').TransferConfidentialOptions} TransferConfidentialOptions */
/** @typedef {import('./confidential-protocol.js').WithdrawConfidentialOptions} WithdrawConfidentialOptions */
/** @typedef {import('./confidential-protocol.js').GetConfidentialBalanceOptions} GetConfidentialBalanceOptions */
/** @typedef {import('./confidential-protocol.js').QuoteTransferConfidentialOptions} QuoteTransferConfidentialOptions */
/** @typedef {import('./confidential-protocol.js').ConfidentialResult} ConfidentialResult */
/** @typedef {import('./confidential-protocol.js').ConfidentialKeys} ConfidentialKeys */
/** @typedef {import('./confidential-protocol.js').ConfidentialBalanceResult} ConfidentialBalanceResult */

/**
 * @typedef {Object} ConfidentialProtocolConfig
 * @property {string} rpcUrl - The RPC URL of the blockchain network.
 * @property {number} chainId - The chain ID.
 */

/**
 * Enables confidentiality for a WDK account by patching it with confidential methods.
 *
 * @param {WalletAccountEvm} account - The WDK wallet account to enable confidentiality for.
 * @param {ConfidentialProtocolConfig} config - The protocol configuration.
 * @returns {Promise<WalletAccountEvm>} The same account instance, patched with confidential methods.
 *
 * @example
 * const confAccount = await enableConfidentiality(account, { rpcUrl, chainId });
 * await confAccount.depositConfidential({ token, amount });
 * await confAccount.transferConfidential({ recipient, token, amount });
 * await confAccount.withdrawConfidential({ token, amount });
 */
export async function enableConfidentiality(account, config) {
  const protocol = new ConfidentialProtocolEvm(account, config);
  await protocol.enableConfidentiality();

  account.depositConfidential = (options) =>
    protocol.depositConfidential(options);
  account.withdrawConfidential = (options) =>
    protocol.withdrawConfidential(options);
  account.transferConfidential = (options) =>
    protocol.transferConfidential(options);
  account.getConfidentialBalance = (options) =>
    protocol.getConfidentialBalance(options);
  account.quoteTransferConfidential = (options) =>
    protocol.quoteTransferConfidential(options);

  return account;
}

export class ConfidentialProtocolEvm extends ConfidentialProtocol {
  /**
   * Creates a new interface to the confidential protocol for evm blockchains.
   *
   * @param {WalletAccountEvm} account - The wallet account to use to interact with the protocol.
   * @param {ConfidentialProtocolConfig} config - The protocol configuration.
   */
  constructor(account, config) {
    super(account);

    /** @private */
    this._config = config;

    /** @private */
    this._client = new ConfidentialTransferClient(
      config.rpcUrl,
      config.chainId,
    );

    /** @private */
    this._keys = undefined;

    if (account._config.provider) {
      const { provider } = account._config;

      /** @private */
      this._provider =
        typeof provider === "string"
          ? new JsonRpcProvider(provider)
          : new BrowserProvider(provider);
    }
  }

  /**
   * @private
   * @returns {Promise<Wallet>} The ethers wallet.
   */
  async _getEthersWallet() {
    if (!this._provider) {
      throw new Error(
        "The wallet must be connected to a provider in order to perform confidential operations.",
      );
    }

    // We need the private key to create the ethers wallet for the SDK
    const privateKey = this._account.keyPair.privateKey;
    // Ensure privateKey is in hex string format
    const privateKeyHex = Buffer.from(privateKey).toString("hex");

    return new Wallet(privateKeyHex, this._provider);
  }

  /**
   * Enables confidentiality for the account.
   *
   * @param {EnableConfidentialityOptions} [options] - The options.
   * @returns {Promise<ConfidentialKeys>} The generated keys.
   */
  async enableConfidentiality(options) {
    const wallet = await this._getEthersWallet();

    // ensureAccount registers the user's public key on the stabletrust contract
    // and returns the keypair used for confidential transactions
    const keys = await this._client.ensureAccount(wallet);

    this._keys = keys;

    return {
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
    };
  }

  /**
   * Deposits tokens into the confidential balance.
   *
   * @param {DepositConfidentialOptions} options - The deposit options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async depositConfidential(options) {
    if (!this._keys) {
      throw new Error(
        "Confidentiality not enabled. Call enableConfidentiality() first.",
      );
    }

    const { token, amount } = options;
    const wallet = await this._getEthersWallet();

    const result = await this._client.confidentialDeposit(
      wallet,
      token,
      amount,
    );

    return { hash: result.hash };
  }

  /**
   * Transfers tokens confidentially.
   *
   * @param {TransferConfidentialOptions} options - The transfer options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async transferConfidential(options) {
    if (!this._keys) {
      throw new Error(
        "Confidentiality not enabled. Call enableConfidentiality() first.",
      );
    }

    const { recipient, token, amount } = options;
    const wallet = await this._getEthersWallet();

    const result = await this._client.confidentialTransfer(
      wallet,
      recipient,
      token,
      amount,
    );

    return { hash: result.hash };
  }

  /**
   * Withdraws tokens from the confidential balance.
   *
   * @param {WithdrawConfidentialOptions} options - The withdraw options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async withdrawConfidential(options) {
    if (!this._keys) {
      throw new Error(
        "Confidentiality not enabled. Call enableConfidentiality() first.",
      );
    }

    const { token, amount } = options;
    const wallet = await this._getEthersWallet();

    const result = await this._client.withdraw(wallet, token, amount);

    return { hash: result.hash };
  }

  /**
   * Gets the confidential balance.
   *
   * @param {GetConfidentialBalanceOptions} options - The balance options.
   * @returns {Promise<ConfidentialBalanceResult>} The confidential balance.
   */
  async getConfidentialBalance(options) {
    if (!this._keys) {
      throw new Error(
        "Confidentiality not enabled. Call enableConfidentiality() first.",
      );
    }

    const { token } = options;
    const address = await this._account.getAddress();

    const result = await this._client.getConfidentialBalance(
      address,
      this._keys.privateKey,
      token,
    );

    return { amount: BigInt(result.amount) };
  }

  /**
   * Quotes a confidential transfer.
   *
   * @param {QuoteTransferConfidentialOptions} options - The quote options.
   * @returns {Promise<bigint>} The quoted amount.
   */
  async quoteTransferConfidential(options) {
    const fee = await this._client.getFeeAmount();
    return fee;
  }
}
