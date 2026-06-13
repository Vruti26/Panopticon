# Real-Time Mempool IDS & Active Defense Engine

> An active, off-chain security framework that monitors local blockchain mempools to detect, intercept, and frontrun malicious transactions before they are confirmed.

##  The Concept
Current Web3 security is purely reactive. Protocols rely on audits, but when a zero-day vulnerability is exploited, developers can only watch the funds drain. **Panopticon** flips this paradigm by introducing an active Intrusion Detection System (IDS). 

Instead of waiting for an attack to confirm, Panopticon monitors the pending transaction pool (mempool). By running a high-speed local state simulation on incoming payloads, it mathematically verifies if a transaction will result in an unauthorized liquidity drain. If a threat is detected, Panopticon dynamically calculates a priority gas bribe and fires an emergency circuit-breaker transaction to pause the contract, effectively frontrunning the attacker and securing the assets.

---

## 🛠️ Architecture & Features

* **Fast Heuristic Engine:** Replaces slow cloud APIs with instantaneous local EVM state-delta simulations.
* **Dynamic Gas Escalation:** Automatically reads attacker fee parameters and outbids them with a calculated premium to guarantee priority block placement.
* **Automated Circuit Breaker:** Interfaces directly with the target protocol's administrative functions to lock access controls mid-attack.

### The Tech Stack
* **Smart Contracts & Local Node:** Foundry, Anvil, Solidity
* **Off-Chain Engine:** Node.js, TypeScript
* **Blockchain Interface:** Ethers.js (v6)

---

## 📸 System Execution & Visual Proof

### 1. The Target Architecture
*A vulnerable protocol deployed to the local Anvil node with 20 ETH in locked liquidity.*

<img width="1920" height="1020" alt="Screenshot 2026-06-13 204244" src="https://github.com/user-attachments/assets/c78a6a73-7861-4b3d-9d64-6b5f670c361e" />

<img width="1920" height="1020" alt="Screenshot 2026-06-13 204239" src="https://github.com/user-attachments/assets/0a47ad2d-3305-4236-9acd-bacb4a12eb96" />

<img width="1920" height="1020" alt="Screenshot 2026-06-13 204250" src="https://github.com/user-attachments/assets/1e02eb59-1e92-4fa1-a38b-b7fa4205dcd5" />


### 2. The Attacker's Execution
*A malicious actor broadcasting a crafted payload designed to bypass access controls and drain the contract.*

<img width="1920" height="1020" alt="Screenshot 2026-06-13 203657" src="https://github.com/user-attachments/assets/bd888667-2640-4755-bcfd-6e653464fc01" />

<img width="1920" height="1020" alt="Screenshot 2026-06-13 203704" src="https://github.com/user-attachments/assets/ceed6941-e3fa-4039-9a00-f9a4ef80f442" />


### 3. Panopticon Interception (Active Defense)
*The off-chain engine successfully intercepts the payload, simulates the state-drop, and fires the priority frontrun transaction.*

<img width="1920" height="1020" alt="Screenshot 2026-06-13 203647" src="https://github.com/user-attachments/assets/e1d8933c-2480-4f2b-a8f2-c7a086263704" />


### During hack


<img width="1920" height="1020" alt="Screenshot 2026-06-13 224445" src="https://github.com/user-attachments/assets/2d41671b-c7e3-46fc-9653-f7058374289e" />


<img width="1920" height="1020" alt="Screenshot 2026-06-13 224433" src="https://github.com/user-attachments/assets/7c18bc48-9179-4768-add1-a334b0db282b" />


---

## 💻 Local Setup & Execution Guide


***The Installation Script**
Open your terminal (Linux, macOS, or WSL on Windows) and paste these commands one by one:

Bash
# 1. Download the Foundry upgrader tool
```curl -L https://foundry.paradigm.xyz | bash```

# 2. Reload your terminal configuration so it recognizes the new tool
```source ~/.bashrc```

# 3. Install the actual binaries (Forge, Anvil, Cast, Chisel)
```foundryup```
(Note: If you are using a Mac with Zsh instead of Bash, use source ~/.zshrc for step 2).



Verify the Installation
To make sure everything worked perfectly, run these two commands to check the version numbers:

Bash
```
forge --version
anvil --version
```
-------

**1. Boot the Local Blockchain**

# Start the Anvil node in Terminal 1
```bash
anvil 
```
2. Deploy the Infrastructure


# In Terminal 2, compile and deploy the vulnerable bank
```bash 
cd contracts
forge build
forge script script/Deploy.s.sol --rpc-url [http://127.0.0.1:8545](http://127.0.0.1:8545) --broadcast
```
3. Arm the Defense Engine

# In Terminal 3, initialize the monitoring bot

```
npm install
npm run server
```

4. Simulate the Attack


# Back in Terminal 2, fire the exploit payload using a secondary Anvil account

```
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "brokenWithdraw(uint256)" 20000000000000000000 --private-key <ATTACKER_PRIVATE_KEY>
```

 ***Future Scope & Upgrades***
While this PoC relies on public mempool visibility, modern Ethereum attackers utilize private transaction relays (like Flashbots). The next iteration of this architecture will involve:

**Flashbots Integration: Utilizing private relays for the rescue transaction to prevent gas-war escalation.**

ZK Invariant Proofs: Allowing security researchers to mathematically prove the existence of an exploit via zk-SNARKs (Circom) without revealing the payload, enabling a trustless bug bounty escrow.
