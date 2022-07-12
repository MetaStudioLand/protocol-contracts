import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';
import { Signers } from '../test/shared/types';
import { ethers } from 'ethers';
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deployer} = await getNamedAccounts();
  const {deploy} = deployments;
  const signers = {} as Signers;
  await deploy('MetaStudioToken', {
    contract: 'MetaStudioToken',
    from: deployer,
    proxy: {
      proxyContract: 'ERC1967Proxy',
      proxyArgs: ['{implementation}', '{data}'],
      execute: {
        init: {
          methodName: 'initialize',
          args: [signers.initialHolder.address, ethers.constants.AddressZero],
        },
      },
    },
    log: true,
  });

  
};
export default func;
func.tags = ['MetaStudioToken'];