import type {
  WalletAccountEvm,
  WalletAccountReadOnlyEvm,
} from "@tetherto/wdk-wallet-evm";

export type Amount = number | bigint;

export interface EnableConfidentialityOptions {}

export interface DepositConfidentialOptions {
  token: string;
  amount: Amount;
}

export interface TransferConfidentialOptions {
  recipient: string;
  token: string;
  amount: Amount;
}

export interface WithdrawConfidentialOptions {
  token: string;
  amount: Amount;
}

export interface GetConfidentialBalanceOptions {
  token: string;
}

export interface QuoteTransferConfidentialOptions {}

export interface ConfidentialResult {
  hash: string;
}

export interface ConfidentialKeys {
  publicKey: string;
  privateKey: string;
}

export interface ConfidentialBalanceResult {
  amount: bigint;
}

export interface ConfidentialProtocolConfig {
  rpcUrl: string;
  chainId: number;
}

/**
 * A WDK account patched with confidential methods after calling enableConfidentiality().
 */
export type ConfidentialAccount<
  T extends WalletAccountReadOnlyEvm | WalletAccountEvm =
    WalletAccountEvm,
> = T & {
  depositConfidential(
    options: DepositConfidentialOptions,
  ): Promise<ConfidentialResult>;
  transferConfidential(
    options: TransferConfidentialOptions,
  ): Promise<ConfidentialResult>;
  withdrawConfidential(
    options: WithdrawConfidentialOptions,
  ): Promise<ConfidentialResult>;
  getConfidentialBalance(
    options: GetConfidentialBalanceOptions,
  ): Promise<ConfidentialBalanceResult>;
  quoteTransferConfidential(
    options?: QuoteTransferConfidentialOptions,
  ): Promise<bigint>;
};

/**
 * Enables confidentiality for a WDK account by patching it with confidential methods.
 * Registers the account's public key on-chain and returns the same account instance
 * augmented with confidential operations.
 *
 * @example
 * const confAccount = await enableConfidentiality(account, { rpcUrl, chainId });
 * await confAccount.depositConfidential({ token, amount });
 * await confAccount.transferConfidential({ recipient, token, amount });
 * await confAccount.withdrawConfidential({ token, amount });
 */
export declare function enableConfidentiality(
  account: WalletAccountEvm,
  config: ConfidentialProtocolConfig,
): Promise<ConfidentialAccount<WalletAccountEvm>>;

export declare class NotImplementedError extends Error {
  constructor(methodName: string);
}

export declare class IConfidentialProtocol {
  enableConfidentiality(
    options?: EnableConfidentialityOptions,
  ): Promise<ConfidentialKeys>;
  depositConfidential(
    options: DepositConfidentialOptions,
  ): Promise<ConfidentialResult>;
  transferConfidential(
    options: TransferConfidentialOptions,
  ): Promise<ConfidentialResult>;
  withdrawConfidential(
    options: WithdrawConfidentialOptions,
  ): Promise<ConfidentialResult>;
  getConfidentialBalance(
    options: GetConfidentialBalanceOptions,
  ): Promise<ConfidentialBalanceResult>;
  quoteTransferConfidential(
    options: QuoteTransferConfidentialOptions,
  ): Promise<bigint>;
}

export declare class ConfidentialProtocol extends IConfidentialProtocol {
  protected _account: WalletAccountReadOnlyEvm | WalletAccountEvm;

  constructor(account: WalletAccountReadOnlyEvm);
  constructor(account: WalletAccountEvm);
}

export declare class ConfidentialProtocolEvm extends ConfidentialProtocol {
  constructor(account: WalletAccountEvm, config: ConfidentialProtocolConfig);
}
