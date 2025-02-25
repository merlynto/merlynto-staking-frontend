const hre = require("hardhat");

async function main() {
  // Deploy a mock ERC20 token for staking
  const Token = await hre.ethers.getContractFactory("MockERC20");
  const stakingToken = await Token.deploy("Staking Token", "STK", hre.ethers.parseUnits("1000000", 18));
  await stakingToken.waitForDeployment();

  // Deploy a mock ERC20 token for rewards
  const rewardToken = await Token.deploy("Reward Token", "RWD", hre.ethers.parseUnits("1000000", 18));
  await rewardToken.waitForDeployment();

  // Use the fully qualified name to get the correct artifact if needed.
  const StakingContract = await hre.ethers.getContractFactory("contracts/MerlyntoStaking.sol:MerlyntoStaking");
  const staking = await StakingContract.deploy(stakingToken.target, rewardToken.target);
  await staking.waitForDeployment();

  console.log(`Staking contract deployed to: ${staking.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
