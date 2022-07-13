import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deployer} = await getNamedAccounts();
  const {deploy} = deployments;

  await deploy("Test", {
    contract: "Test",
    from: deployer,
    args: [],
    log: true,
  });
};
export default func;
func.tags = ["Test"];
