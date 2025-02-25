// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Staking {
    mapping(address => uint256) public balances;

    function stake() external payable {
        require(msg.value > 0, "Must stake some ETH");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
