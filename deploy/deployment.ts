const {ethers, upgrades} = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const MetaStudioToken = await ethers.getContractFactory(
    "MetaStudioToken",
    deployer
  );
  console.log("-_-_-");
  
  const mc = await upgrades.deployProxy(MetaStudioToken, [
    deployer.address,
  ]);
  console.log("__________________________________________");
  
  await mc.deployed();

  console.log("MetaStudioToken deployed to:", mc.address);
  console.log(await upgrades.erc1967.getImplementationAddress(mc.address));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});