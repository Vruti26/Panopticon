import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

const PROVIDER_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

// Contract Compilation Artifact Setup
const ARTIFACT_PATH = path.join(__dirname, "../contracts/out/VulnerableBank.sol/VulnerableBank.json");
if (!fs.existsSync(ARTIFACT_PATH)) {
    console.error("[❌] Error: Contract artifact not found. Please compile contracts first via forge build.");
    process.exit(1);
}
const contractArtifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, "utf8"));

// Anvil Hardcoded Admin Parameters (Account 0)
const DEFENDER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(DEFENDER_PRIVATE_KEY, provider);

const TARGET_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const bankContract = new ethers.Contract(TARGET_CONTRACT_ADDRESS, contractArtifact.abi, wallet);

// Shared state for frontend dashboard polling
export interface LogEntry {
    id: string;
    timestamp: number;
    type: "INFO" | "WARN" | "ALERT" | "SUCCESS";
    message: string;
}
export let securityLogs: LogEntry[] = [];

function pushLog(type: "INFO" | "WARN" | "ALERT" | "SUCCESS", message: string) {
    const log: LogEntry = {
        id: Math.random().toString(36).substring(2, 10), // Simplified ID generation
        timestamp: Date.now(),
        type,
        message
    };
    securityLogs.unshift(log);
    console.log(`[${type}] ${message}`);
}

export async function runPanopticonEngine() {
    pushLog("INFO", "Initializing Panopticon Core System...");
    pushLog("INFO", `Target Smart Contract Locked: ${TARGET_CONTRACT_ADDRESS}`);

    // Added the explicit ': number' type to fix the TS7006 error
    provider.on("block", async (blockNumber: number) => {
        try {
            const block = await provider.getBlock(blockNumber, true);
            if (!block || !block.prefetchedTransactions) return;

            for (const tx of block.prefetchedTransactions) {
                if (tx.to?.toLowerCase() === TARGET_CONTRACT_ADDRESS.toLowerCase()) {
                    await processMempoolPayload(tx);
                }
            }
        } catch (err) {
            console.error("Error processing tracking framework block sequence:", err);
        }
    });
}

async function processMempoolPayload(tx: ethers.TransactionResponse) {
    pushLog("INFO", `Intercepted incoming transaction in block sequence from: ${tx.from}`);
    
    try {
        // 1. Run the local simulation. 
        // If the vault is empty or the hack is invalid, this crashes and goes to the 'catch' block.
        await provider.call({
            from: tx.from,
            to: tx.to,
            data: tx.data,
            value: tx.value
        });

        // 2. If the simulation succeeds AND contains malicious function data (not just a basic ETH transfer)
        if (tx.data !== "0x") {
            pushLog("ALERT", `CRITICAL VULNERABILITY HIT DETECTED! Sender ${tx.from} attempts total pool drain.`);
            await triggerFrontrunAction(tx);
        }
    } catch (simulationRevert) {
        // Transaction naturally reverts (e.g., they tried to steal from an empty vault)
    }
}

async function triggerFrontrunAction(attackerTx: ethers.TransactionResponse) {
    pushLog("WARN", "Initiating Active Defense Execution Block...");
    
    const attackerGasPrice = attackerTx.gasPrice || 20000000000n;
    const defenseGasPrice = (attackerGasPrice * 200n) / 100n; 
    
    pushLog("WARN", `Bidding Strategy Locked. Attacker Gas: ${ethers.formatUnits(attackerGasPrice, "gwei")} gwei. Defense Gas Bribe: ${ethers.formatUnits(defenseGasPrice, "gwei")} gwei.`);

    try {
        pushLog("INFO", "Broadcasting Priority Circuit-Breaker Transaction...");
        const txResponse = await bankContract.setPause(true, {
            gasPrice: defenseGasPrice,
            gasLimit: 120000
        });
        
        pushLog("SUCCESS", `Frontrun Successful! Emergency Shield Implemented. Hash: ${txResponse.hash}`);
        await txResponse.wait();
        pushLog("SUCCESS", "Contract State Transformed to PAUSED. Attack successfully neutralized.");
    } catch (executionError: any) {
        pushLog("ALERT", `Defense Failed during gas execution cycle: ${executionError.message}`);
    }
}

if (require.main === module) {
    runPanopticonEngine().catch(console.error);
}