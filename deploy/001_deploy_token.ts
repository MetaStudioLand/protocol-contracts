import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
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
          args: [initialHolder, ethers.constants.AddressZero],
        },
      },
    },
    log: true,
  });
};
export default func;
func.tags = ['MetaStudioToken'];
