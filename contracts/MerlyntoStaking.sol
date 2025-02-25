// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MerlyntoStaking {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    mapping(address => uint256) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(stakes[msg.sender] >= amount, "Insufficient balance");
        stakes[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function getStake(address user) external view returns (uint256) {
        return stakes[user];
    }
}
