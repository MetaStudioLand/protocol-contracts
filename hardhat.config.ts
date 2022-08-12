import '@nomiclabs/hardhat-ethers';
import '@primitivefi/hardhat-dodoc';
import '@typechain/hardhat';
import * as dotenv from 'dotenv';
import 'dotenv/config';
import 'hardhat-deploy';
import 'hardhat-deploy-tenderly';
import 'hardhat-gas-reporter';
import 'hardhat-tracer';
import {task} from 'hardhat/config';
import {HardhatUserConfig} from 'hardhat/types';
import 'solidity-coverage';
import 'hardhat-contract-sizer'
import "@nomiclabs/hardhat-etherscan";
import {accounts, addForkConfiguration, node_url} from './utils/network';

dotenv.config();

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    initialHolder: {
      default: 1,
      "mumbai": '0x5Bd37f8c00fa19CE149018C7Fcc99448da8C84cb',
      "polygon": '0xB14419e095d7D5765eB108e84A817241FE4CE49a',
      "goerli": '0xc1895D76528CAe865f1D71E101308606a534c35E',
    },
    forwarder: 2,
  },
  tracer: {
    logs: true,
    calls: true,
    gasCost: true,
    sloads: false,
    sstores: false,
  },
  dodoc: {
    runOnCompile: true,
    include: ['tokens', 'metatx', 'ERC1363'],
    exclude: ['mocks', 'elin', 'IERC2771Upgradeable'],
    debugMode: false,
  },
  networks: addForkConfiguration({
    hardhat: {
      initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see
      // https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
    },
    localhost: {
      url: node_url('localhost'),
      accounts: accounts(),
    },
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
    },
    goerli: {
      url: node_url('goerli'),
      accounts: accounts('goerli'),
    },
    mumbai: {
      url: node_url('mumbai'),
      accounts: accounts('mumbai'),
    },
    polygon: {
      url: node_url('polygon'),
      accounts: accounts('polygon'),
      gasPrice: 200000000000
    },
  }),
  paths: {
    sources: 'src',
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  mocha: {
    timeout: 0,
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.ETHERSCAN_API_KEY as string,
      polygon: process.env.ETHERSCAN_API_KEY as string,
      goerli: process.env.ETHERSCAN_API_KEY as string,
    }
  },

  external: process.env.HARDHAT_FORK
    ? {
        deployments: {
          // process.env.HARDHAT_FORK will specify the network that the fork is made from.
          // these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
          hardhat: ['deployments/' + process.env.HARDHAT_FORK],
          localhost: ['deployments/' + process.env.HARDHAT_FORK],
        },
      }
    : undefined,

  tenderly: {
    project: 'template-ethereum-contracts',
    username: process.env.TENDERLY_USERNAME as string,
  },
};

export default config;
