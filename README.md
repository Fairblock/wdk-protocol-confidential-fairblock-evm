# @fairblock/wdk-protocol-confidential-fairblock-evm

**Note**: This package is currently in beta. Please test thoroughly in development environments before using in production.

A privacy-preserving package that lets EVM wallet accounts perform confidential token transfers using the Fairblock protocol. This package provides a clean SDK for depositing, transferring, and withdrawing tokens confidentially on supported EVM-compatible chains using the StableTrust contract system.

This module can be managed by the [`@tetherto/wdk`](https://github.com/tetherto/wdk-core) package, which provides a unified interface for managing multiple WDK wallet and protocol modules across different blockchains.

## 🔍 About WDK

This module is part of the [**WDK (Wallet Development Kit)**](https://wallet.tether.io/) project, which empowers developers to build secure, non-custodial wallets with unified blockchain access, stateless architecture, and complete user control.

For detailed documentation about the complete WDK ecosystem, visit [docs.wallet.tether.io](https://docs.wallet.tether.io).

## 🌟 Features

- **Confidential Transfers**: Move tokens privately between addresses without revealing amounts or recipients on-chain.
- **Fairblock Integration**: Full integration with Fairblock's encryption and privacy technologies.
- **StableTrust Wrapper**: Simplified interaction with the StableTrust contract for confidential operations.
- **Account Abstraction**: Works seamlessly with WDK EVM wallet accounts.
- **Key Management**: Automatically handles key derivation and registration for confidential operations.
- **Balance Privacy**: Check confidential balances that are only visible to the key holder.
- **Memory Safety**: Secure transaction handling with proper error management.
- **Provider Flexibility**: Works with JSON-RPC URLs and EIP-1193 browser providers.

## ⬇️ Installation

To install the `@fairblock/wdk-protocol-confidential-fairblock-evm` package, follow these instructions:

You can install it using npm:

```bash
npm install @fairblock/wdk-protocol-confidential-fairblock-evm
```

## 🚀 Quick Start

### Prerequisites

You will need the following configuration values for the network you are connecting to:

- **RPC URL**: A JSON-RPC endpoint for the EVM chain.
- **Chain ID**: The numeric chain ID of the network.
- **Token Address**: The address of the ERC-20 token you want to use.

### Usage example

```javascript
import { enableConfidentiality } from "@fairblock/wdk-protocol-confidential-fairblock-evm";
import WDK from "@tetherto/wdk";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";

// Setup WDK account
const wdk = new WDK(process.env.SEED_PHRASE).registerWallet(
  "ethereum",
  WalletManagerEvm,
  { provider: "https://rpc.testnet.stable.xyz" },
);
const account = await wdk.getAccount("ethereum", 0);

// Enable confidentiality — patches the account with confidential methods
const confAccount = await enableConfidentiality(account, {
  rpcUrl: "https://rpc.testnet.stable.xyz",
  chainId: 2201,
});

// Check Confidential Balance
const balance = await confAccount.getConfidentialBalance({
  token: "0x78Cf24370174180738C5B8E352B6D14c83a6c9A9",
});
console.log("Confidential Balance:", balance.amount);

// Deposit to Confidential Balance
const depositResult = await confAccount.depositConfidential({
  token: "0x78Cf24370174180738C5B8E352B6D14c83a6c9A9",
  amount: 100n,
});
console.log("Deposit Hash:", depositResult.hash);

// Withdraw to Public Address
const withdrawResult = await confAccount.withdrawConfidential({
  token: "0x78Cf24370174180738C5B8E352B6D14c83a6c9A9",
  amount: 500000n,
});
console.log("Withdrawal Hash:", withdrawResult.hash);
```

## 📚 API Reference

### Table of Contents

| Export                                              | Description                                                          |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| [`enableConfidentiality`](#enableconfidentiality)   | Main function — wraps a WDK account with confidential capabilities.  |
| [`ConfidentialProtocolEvm`](#confidentialprotocolevm) | Lower-level class for advanced use cases.                          |

### `enableConfidentiality(account, config)`

The primary API. Takes a WDK account, registers it for confidential operations on-chain, and patches it in-place with confidential methods. Returns the same account instance.

```javascript
const confAccount = await enableConfidentiality(account, config);
```

**Parameters:**

- `account` (WalletAccountEvm): The WDK wallet account to wrap.
- `config` (object): Configuration object.
  - `rpcUrl` (string): JSON-RPC URL of the network.
  - `chainId` (number): Chain ID of the network.

**Returns:** `Promise<ConfidentialAccount>` — the original account patched with the methods below.

#### Methods on `confAccount`

| Method                                | Description                                          | Returns                              |
| ------------------------------------- | ---------------------------------------------------- | ------------------------------------ |
| `depositConfidential(options)`        | Deposits tokens into confidential balance.           | `Promise<ConfidentialResult>`        |
| `transferConfidential(options)`       | Transfers tokens confidentially.                     | `Promise<ConfidentialResult>`        |
| `withdrawConfidential(options)`       | Withdraws tokens to public balance.                  | `Promise<ConfidentialResult>`        |
| `getConfidentialBalance(options)`     | Gets the decrypted confidential balance.             | `Promise<ConfidentialBalanceResult>` |
| `quoteTransferConfidential(options?)` | Gets the estimated cost for a confidential transfer. | `Promise<bigint>`                    |

##### `depositConfidential(options)`

Convert public tokens into confidential tokens.

**Parameters:**

- `options` (object):
  - `token` (string): Address of the ERC-20 token.
  - `amount` (bigint): Amount to deposit (in base units).

**Returns:** `Promise<{ hash: string }>`

##### `transferConfidential(options)`

Send tokens privately to another address.

**Parameters:**

- `options` (object):
  - `recipient` (string): Public address of the recipient.
  - `token` (string): Address of the ERC-20 token.
  - `amount` (bigint): Amount to transfer.

**Returns:** `Promise<{ hash: string }>`

##### `withdrawConfidential(options)`

Convert confidential tokens back to public tokens.

**Parameters:**

- `options` (object):
  - `token` (string): Address of the ERC-20 token.
  - `amount` (bigint): Amount to withdraw.

**Returns:** `Promise<{ hash: string }>`

##### `getConfidentialBalance(options)`

Fetch and decrypt the confidential balance for a specific token.

**Parameters:**

- `options` (object):
  - `token` (string): Address of the ERC-20 token.

**Returns:** `Promise<{ amount: bigint }>`

##### `quoteTransferConfidential(options?)`

Gets the estimated fee for a confidential transfer operation.

**Returns:** `Promise<bigint>` - Estimated fee in base units.

## 🌐 Supported Networks

This package is designed for EVM-compatible networks where the Fairblock / StableTrust contracts are deployed.

| Network  | Chain ID |
| -------- | -------- |
| Stable   | 2201     |
| Arc      | 1244     |
| Base     | 84532    |
| Ethereum | 11155111 |
| Arbitrum | 421614   |
| Tempo    | 42431    |

**Token Support:**

- Supports standard ERC-20 tokens that are compatible with the StableTrust contract.

## 🔒 Security Considerations

- **Key Management**: When `enableConfidentiality` is called, a private key is derived in memory. This key is sensitive and allows decryption of balances. It is not stored persistently by the SDK.
- **Provider Connection**: A secure connection to the RPC provider is required for operations.
- **Signature Request**: Users must approve the signature request to derive keys safely.

## 🛠️ Development

### Building

```bash
# Install dependencies
npm install

# Lint code
npm run lint
```

### Testing

```bash
# Run tests (if configured)
npm test
```

## 📜 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

For support, please open an issue on the GitHub repository.
