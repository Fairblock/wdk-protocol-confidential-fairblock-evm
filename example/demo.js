import WDK from "@tetherto/wdk";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { enableConfidentiality } from "../src/fairblock-protocol-evm.js";
import { ERC20_ABI } from "./constants.js";
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

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const tokenContract = new ethers.Contract(
      USDT0_CONTRACT_ADDRESS,
      ERC20_ABI,
      provider,
    );
    const tokenDecimals = await tokenContract.decimals();

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

    console.log("\n--- Enabling Confidentiality ---");

    // Wrap accounts with confidential capabilities
    console.log(`Enabling confidentiality for ${senderAddress}...`);
    const confSender = await enableConfidentiality(sender, CONFIDENTIAL_CONFIG);

    console.log(`Enabling confidentiality for ${receiverAddress}...`);
    const confReceiver = await enableConfidentiality(
      receiver,
      CONFIDENTIAL_CONFIG,
    );

    console.log("✓ Confidential accounts enabled");

    // A. DEPOSIT
    console.log("\n--- 1. CONFIDENTIAL DEPOSIT ---");
    console.log("Depositing 1 tokens into confidential balance...");
    const depositAmount = ethers.parseUnits("1", tokenDecimals);

    // Check pre-deposit balance
    let senderConfBalanceBefore = await confSender.getConfidentialBalance({
      token: USDT0_CONTRACT_ADDRESS,
    });

    console.log(
      `Pre-Deposit Confidential Balance(Sender): ${ethers.formatUnits(senderConfBalanceBefore.amount, tokenDecimals)} USDT0`,
    );

    const depRes = await confSender.depositConfidential({
      token: USDT0_CONTRACT_ADDRESS,
      amount: depositAmount,
    });
    console.log(`Tx Hash: ${depRes.hash}`);
    console.log(`View Transaction: ${EXPLORER_URL}${depRes.hash}`);

    let senderConfBalanceAfter = await confSender.getConfidentialBalance({
      token: USDT0_CONTRACT_ADDRESS,
    });

    console.log(
      `Post-Deposit Confidential Balance(Sender): ${ethers.formatUnits(senderConfBalanceAfter.amount, tokenDecimals)} USDT0`,
    );

    // B. TRANSFER
    console.log("\n--- 2. CONFIDENTIAL TRANSFER ---");
    console.log("Transferring 0.5 tokens confidentially to recipient...");
    const transferAmount = ethers.parseUnits("0.5", tokenDecimals);

    const txRes = await confSender.transferConfidential({
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
      await confSender.getConfidentialBalance({
        token: USDT0_CONTRACT_ADDRESS,
      });
    console.log(
      `Post-Transfer Confidential Balance(Sender): ${ethers.formatUnits(senderConfBalanceAfterTransfer.amount, tokenDecimals)} USDT0`,
    );

    // C. WITHDRAW
    console.log("\n--- 3. WITHDRAW ---");
    console.log("Withdrawing 0.5 tokens to public balance...");
    const withdrawAmount = ethers.parseUnits("0.5", tokenDecimals);

    const withdrawRes = await confReceiver.withdrawConfidential({
      token: USDT0_CONTRACT_ADDRESS,
      amount: withdrawAmount,
    });

    console.log(`Tx Hash: ${withdrawRes.hash}`);
    console.log(`View Transaction: ${EXPLORER_URL}${withdrawRes.hash}`);
    let receiverConfBalanceAfterWithdraw =
      await confReceiver.getConfidentialBalance({
        token: USDT0_CONTRACT_ADDRESS,
      });
    console.log(
      `Post-Withdraw Confidential Balance(Receiver): ${ethers.formatUnits(receiverConfBalanceAfterWithdraw.amount, tokenDecimals)} USDT0`,
    );

    console.log("\n=== Demo Complete ===");
  } catch (err) {
    console.error("Error starting App:", err.message);
    console.error("Full error:", err);
  }
}

main();
