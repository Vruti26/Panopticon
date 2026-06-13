// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VulnerableBank {
    address public owner;
    bool public paused;
    mapping(address => uint256) public balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event EmergencyShieldActivated(address indexed admin);

    modifier onlyOwner() {
        require(msg.sender == owner, "Auth: Caller is not the administrator");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Status: Contract operations are currently paused");
        _;
    }

    constructor() {
        owner = msg.sender;
        paused = false;
    }

    function deposit() public payable whenNotPaused {
        require(msg.value > 0, "Validation: Deposit amount must exceed zero");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    // THE LOOPHOLE VULNERABILITY: Intentionally broken logic for verification
    // This function allows an execution context to extract arbitrary liquidity pools.
    function brokenWithdraw(uint256 _amount) public whenNotPaused {
        require(address(this).balance >= _amount, "Execution: Insufficient contract liquidity");
        
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Execution: ETH transfer sequence failed");
        
        // State update happens after external call execution (Classic Vulnerability Vector)
        if (balances[msg.sender] >= _amount) {
            balances[msg.sender] -= _amount;
        } else {
            balances[msg.sender] = 0;
        }
        emit Withdrawn(msg.sender, _amount);
    }

    function setPause(bool _paused) public onlyOwner {
        paused = _paused;
        if (_paused) {
            emit EmergencyShieldActivated(msg.sender);
        }
    }

    receive() external payable {
        balances[msg.sender] += msg.value;
    }
}