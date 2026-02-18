import WDK from "@tetherto/wdk";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";
import { ethers } from "ethers";
import dotenv from "dotenv";
import ConfidentialProtocolEvm from "../src/fairblock-protocol-evm.js";

dotenv.config();

const USDT0_CONTRACT_ADDRESS = "0x78Cf24370174180738C5B8E352B6D14c83a6c9A9";
const RPC_URL = "https://rpc.testnet.stable.xyz";
const EXPLORER_URL = "https://testnet.stablescan.xyz/tx/";
const CHAIN_ID = 2201;

const CONFIDENTIAL_CONFIG = {
  rpcUrl: RPC_URL,
  chainId: CHAIN_ID,
};

async function main() {
  console.log(
    "Starting Tether x Fairblock Confidential Demo (WDK Protocol Integration)...",
  );
  try {
    const customSeedPhrase = process.env.SEED_PHRASE;
    if (!customSeedPhrase) {
      throw new Error("SEED_PHRASE not found in environment variables");
    }

    console.log("\n--- Initialize Tether WDK (Ethereum) ---");

    const wdkWithWallets = new WDK(customSeedPhrase).registerWallet(
      "ethereum",
      WalletManagerEvm,
      {
        provider: RPC_URL,
      },
    );
    console.log("✓ Wallet registered for Stable Testnet");

    console.log("\n--- Account Details ---");
    const sender = await wdkWithWallets.getAccount("ethereum", 0);
    const receiver = await wdkWithWallets.getAccount("ethereum", 1);

    const senderAddress = await sender.getAddress();
    const receiverAddress = await receiver.getAddress();

    // --- FAIRBLOCK INTEGRATION START ---
    console.log("\n--- Initializing Confidential Protocols ---");

    // 1. Initialize Protocol Wrappers
    const senderProtocol = new ConfidentialProtocolEvm(
      sender,
      CONFIDENTIAL_CONFIG,
    );
    const receiverProtocol = new ConfidentialProtocolEvm(
      receiver,
      CONFIDENTIAL_CONFIG,
    );

    // 2. Enable Confidentiality
    console.log(`Enabling confidentiality for ${senderAddress}...`);
    await senderProtocol.enableConfidentiality();

    console.log(`Enabling confidentiality for ${receiverAddress}...`);
    await receiverProtocol.enableConfidentiality();

    console.log("✓ Confidential accounts enabled via ConfidentialProtocolEvm");

    // 3. Confidential Flow

    // A. DEPOSIT
    console.log("\n--- 1. CONFIDENTIAL DEPOSIT ---");
    console.log("Depositing 1 tokens into confidential balance...");
    const depositAmount = ethers.parseUnits("1", 2);

    // Check pre-deposit balance
    let senderConfBalanceBefore = await senderProtocol.getConfidentialBalance({
      token: USDT0_CONTRACT_ADDRESS,
    });

    console.log(
      `Pre-Deposit Confidential Balance(Sender): ${ethers.formatUnits(senderConfBalanceBefore.amount, 2)} USDT0`,
    );

    const depRes = await senderProtocol.depositConfidential({
      token: USDT0_CONTRACT_ADDRESS,
      amount: depositAmount,
    });
    console.log(`Tx Hash: ${depRes.hash}`);
    console.log(`View Transaction: ${EXPLORER_URL}${depRes.hash}`);

    let senderConfBalanceAfter = await senderProtocol.getConfidentialBalance({
      token: USDT0_CONTRACT_ADDRESS,
    });

    console.log(
      `Post-Deposit Confidential Balance(Sender): ${ethers.formatUnits(senderConfBalanceAfter.amount, 2)} USDT0`,
    );

    // B. TRANSFER
    console.log("\n--- 2. CONFIDENTIAL TRANSFER ---");
    console.log("Transferring 0.5 tokens confidentially to recipient...");
    const transferAmount = ethers.parseUnits("0.5", 2);

    const txRes = await senderProtocol.transferConfidential({
      recipient: receiverAddress,
      token: USDT0_CONTRACT_ADDRESS,
      amount: transferAmount,
    });

    console.log(
      "Status: Confidential Transfer is completed. Transfer amount is hidden on-chain.",
    );
    console.log(`Tx Hash: ${txRes.hash}`);
    console.log(`View Transaction: ${EXPLORER_URL}${txRes.hash}`);

    let senderConfBalanceAfterTransfer =
      await senderProtocol.getConfidentialBalance({
        token: USDT0_CONTRACT_ADDRESS,
      });
    console.log(
      `Post-Transfer Confidential Balance(Sender): ${ethers.formatUnits(senderConfBalanceAfterTransfer.amount, 2)} USDT0`,
    );

    // C. WITHDRAW
    console.log("\n--- 3. WITHDRAW ---");
    console.log("Withdrawing 0.5 tokens to public balance...");
    const withdrawAmount = ethers.parseUnits("0.5", 2);

    const withdrawRes = await receiverProtocol.withdrawConfidential({
      token: USDT0_CONTRACT_ADDRESS,
      amount: withdrawAmount,
    });

    console.log(`Tx Hash: ${withdrawRes.hash}`);
    console.log(`View Transaction: ${EXPLORER_URL}${withdrawRes.hash}`);
    let receiverConfBalanceAfterWithdraw =
      await receiverProtocol.getConfidentialBalance({
        token: USDT0_CONTRACT_ADDRESS,
      });
    console.log(
      `Post-Withdraw Confidential Balance(Receiver): ${ethers.formatUnits(receiverConfBalanceAfterWithdraw.amount, 2)} USDT0`,
    );

    console.log("\n=== Demo Complete ===");
  } catch (err) {
    console.error("Error starting App:", err.message);
    console.error("Full error:", err);
  }
}

main();
