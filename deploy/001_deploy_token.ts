import {DeployFunction} from 'hardhat-deploy/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deployer, initialHolder} = await getNamedAccounts();
  const {deploy} = deployments;
  await deploy('MetaStudioToken', {
    contract: 'MetaStudioToken',
    from: deployer,
    args: [],
    proxy: {
      proxyContract: 'ERC1967Proxy',
      proxyArgs: ['{implementation}', '{data}'],
      execute: {
        init: {
          methodName: 'initialize',
          args: [initialHolder],
        },
      },
    },
    log: true,
  });
};
export default func;
func.tags = ['MetaStudioToken'];
