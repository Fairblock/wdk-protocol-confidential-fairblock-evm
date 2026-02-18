# wdk-protocol-confidential-fairblock-evm

A lightweight protocol wrapper that lets WDK EVM accounts interact with Fairblock confidential transfers on EVM chains.

## What this package does

It provides a single class, `ConfidentialProtocolEvm`, to run a confidential token flow:

- enable confidentiality for an account
- deposit into confidential balance
- transfer confidentially
- withdraw back to public balance
- read confidential/public balances

## Installation

```bash
npm install wdk-protocol-confidential-fairblock-evm
```

## Quick usage

```js
import WDK from "@tetherto/wdk";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";
import { ethers } from "ethers";
import ConfidentialProtocolEvm from "wdk-protocol-confidential-fairblock-evm";

const RPC_URL = "https://rpc.testnet.stable.xyz";
const CHAIN_ID = 2201;
const STABLETRUST_CONTRACT_ADDRESS =
  "0x29E4fd434758b1677c10854Fa81C2fc496D76E62";
const TOKEN_ADDRESS = "0x78Cf24370174180738C5B8E352B6D14c83a6c9A9";

const wdk = new WDK(process.env.SEED_PHRASE).registerWallet(
  "ethereum",
  WalletManagerEvm,
  {
    provider: RPC_URL,
  },
);

const sender = await wdk.getAccount("ethereum", 0);
const receiver = await wdk.getAccount("ethereum", 1);

const config = {
  stableTrust: STABLETRUST_CONTRACT_ADDRESS,
  rpcUrl: RPC_URL,
  chainId: CHAIN_ID,
};

const senderProtocol = new ConfidentialProtocolEvm(sender, config);
const receiverProtocol = new ConfidentialProtocolEvm(receiver, config);

await senderProtocol.enableConfidentiality();
await receiverProtocol.enableConfidentiality();

await senderProtocol.depositConfidential({
  token: TOKEN_ADDRESS,
  amount: ethers.parseUnits("1", 2),
});

await senderProtocol.transferConfidential({
  recipient: await receiver.getAddress(),
  token: TOKEN_ADDRESS,
  amount: ethers.parseUnits("0.5", 2),
});

await receiverProtocol.withdrawConfidential({
  token: TOKEN_ADDRESS,
  amount: ethers.parseUnits("0.5", 2),
});
```

## API

- `enableConfidentiality(options?)`
- `depositConfidential({ token, amount })`
- `transferConfidential({ recipient, token, amount })`
- `withdrawConfidential({ token, amount })`
- `getConfidentialBalance({ token })`
- `getBalance({ token })`
- `quoteTransferConfidential(options?)`

## Notes

- Your account must be connected to a provider.
- Use base units for amounts (for example `ethers.parseUnits(...)`).
- See `example/demo.js` for a complete end-to-end script.
