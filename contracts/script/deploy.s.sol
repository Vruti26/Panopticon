// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/VulnerableBank.sol";

contract DeployScript is Script {
    function run() external {
        // Anvil Default Account 0 Private Key
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        
        vm.startBroadcast(deployerPrivateKey);
        
        VulnerableBank bank = new VulnerableBank();
        
        // FIX: Call the deposit function directly, which forwards all available gas
        bank.deposit{value: 20 ether}();
        
        vm.stopBroadcast();
    }
}