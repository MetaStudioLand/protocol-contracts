// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const {ethers, upgrades} = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const MetaStudioToken = await ethers.getContractFactory(
    "MetaStudioToken",
    deployer
  );

  const mc = await upgrades.deployProxy(MetaStudioToken, [
    deployer.address,
    ethers.constants.AddressZero,
  ]);

  await mc.deployed();

  console.log("MetaStudioToken deployed to:", mc.address);
  console.log(await upgrades.erc1967.getImplementationAddress(mc.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
