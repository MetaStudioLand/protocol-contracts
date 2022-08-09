/* eslint @typescript-eslint/no-var-requires: "off" */
const {ethers, upgrades} = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const MetaStudioToken = await ethers.getContractFactory(
    "MetaStudioToken",
    deployer
  );  
  const mc = await upgrades.deployProxy(MetaStudioToken, [
    deployer.address,
  ]);  
  await mc.deployed();

  console.log("MetaStudioToken deployed to:", mc.address);
  console.log(await upgrades.erc1967.getImplementationAddress(mc.address));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});