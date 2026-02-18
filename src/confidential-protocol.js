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

"use strict";

export class NotImplementedError extends Error {
  constructor(methodName) {
    super(`Method '${methodName}' is not implemented.`);
    this.name = "NotImplementedError";
  }
}

/** @typedef {import('@tetherto/wdk-wallet-evm').WalletAccountReadOnlyEvm} WalletAccountReadOnlyEvm */
/** @typedef {import('@tetherto/wdk-wallet-evm').WalletAccountEvm} WalletAccountEvm */

/**
 * @typedef {Object} EnableConfidentialityOptions
 */

/**
 * @typedef {Object} DepositConfidentialOptions
 * @property {string} token - The address of the token to deposit.
 * @property {number | bigint} amount - The amount of tokens to deposit (in base unit).
 */

/**
 * @typedef {Object} TransferConfidentialOptions
 * @property {string} recipient - The recipient's address.
 * @property {string} token - The address of the token to transfer.
 * @property {number | bigint} amount - The amount of tokens to transfer (in base unit).
 */

/**
 * @typedef {Object} WithdrawConfidentialOptions
 * @property {string} token - The address of the token to withdraw.
 * @property {number | bigint} amount - The amount of tokens to withdraw (in base unit).
 */

/**
 * @typedef {Object} GetConfidentialBalanceOptions
 * @property {string} token - The address of the token.
 */

/**
 * @typedef {Object} QuoteTransferConfidentialOptions
 */

/**
 * @typedef {Object} ConfidentialResult
 * @property {string} hash - The hash of the operation.
 */

/**
 * @typedef {Object} ConfidentialKeys
 * @property {string} publicKey - The public key.
 * @property {string} privateKey - The private key.
 */

/**
 * @typedef {Object} ConfidentialBalanceResult
 * @property {bigint} amount - The balance amount.
 */

/** @interface */
export class IConfidentialProtocol {
  /**
   * Enables confidentiality for the account.
   *
   * @param {EnableConfidentialityOptions} [options] - The options.
   * @returns {Promise<ConfidentialKeys>} The generated keys.
   */
  async enableConfidentiality(options) {
    throw new NotImplementedError("enableConfidentiality(options)");
  }

  /**
   * Deposits tokens into the confidential balance.
   *
   * @param {DepositConfidentialOptions} options - The deposit options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async depositConfidential(options) {
    throw new NotImplementedError("depositConfidential(options)");
  }

  /**
   * Transfers tokens confidentially.
   *
   * @param {TransferConfidentialOptions} options - The transfer options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async transferConfidential(options) {
    throw new NotImplementedError("transferConfidential(options)");
  }

  /**
   * Withdraws tokens from the confidential balance.
   *
   * @param {WithdrawConfidentialOptions} options - The withdraw options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async withdrawConfidential(options) {
    throw new NotImplementedError("withdrawConfidential(options)");
  }

  /**
   * Gets the confidential balance.
   *
   * @param {GetConfidentialBalanceOptions} options - The balance options.
   * @returns {Promise<ConfidentialBalanceResult>} The confidential balance.
   */
  async getConfidentialBalance(options) {
    throw new NotImplementedError("getConfidentialBalance(options)");
  }

  /**
   * Quotes a confidential transfer.
   *
   * @param {QuoteTransferConfidentialOptions} options - The quote options.
   * @returns {Promise<bigint>} The quoted amount.
   */
  async quoteTransferConfidential(options) {
    throw new NotImplementedError("quoteTransferConfidential(options)");
  }
}

/**
 * @abstract
 * @implements {IConfidentialProtocol}
 */
export default class ConfidentialProtocol {
  /**
   * Creates a new read-only confidential protocol.
   *
   * @overload
   * @param {WalletAccountReadOnlyEvm} account - The wallet account to use to interact with the protocol.
   */

  /**
   * Creates a new confidential protocol.
   *
   * @overload
   * @param {WalletAccountEvm} account - The wallet account to use to interact with the protocol.
   */
  constructor(account) {
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {WalletAccountReadOnlyEvm | WalletAccountEvm}
     */
    this._account = account;
  }

  /**
   * Enables confidentiality for the account.
   *
   * @abstract
   * @param {EnableConfidentialityOptions} [options] - The options.
   * @returns {Promise<ConfidentialKeys>} The generated keys.
   */
  async enableConfidentiality(options) {
    throw new NotImplementedError("enableConfidentiality(options)");
  }

  /**
   * Deposits tokens into the confidential balance.
   *
   * @abstract
   * @param {DepositConfidentialOptions} options - The deposit options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async depositConfidential(options) {
    throw new NotImplementedError("depositConfidential(options)");
  }

  /**
   * Transfers tokens confidentially.
   *
   * @abstract
   * @param {TransferConfidentialOptions} options - The transfer options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async transferConfidential(options) {
    throw new NotImplementedError("transferConfidential(options)");
  }

  /**
   * Withdraws tokens from the confidential balance.
   *
   * @abstract
   * @param {WithdrawConfidentialOptions} options - The withdraw options.
   * @returns {Promise<ConfidentialResult>} The operation result.
   */
  async withdrawConfidential(options) {
    throw new NotImplementedError("withdrawConfidential(options)");
  }

  /**
   * Gets the confidential balance.
   *
   * @abstract
   * @param {GetConfidentialBalanceOptions} options - The balance options.
   * @returns {Promise<ConfidentialBalanceResult>} The confidential balance.
   */
  async getConfidentialBalance(options) {
    throw new NotImplementedError("getConfidentialBalance(options)");
  }

  /**
   * Quotes a confidential transfer.
   *
   * @abstract
   * @param {QuoteTransferConfidentialOptions} options - The quote options.
   * @returns {Promise<bigint>} The quoted amount.
   */
  async quoteTransferConfidential(options) {
    throw new NotImplementedError("quoteTransferConfidential(options)");
  }
}
