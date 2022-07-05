import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@primitivefi/hardhat-dodoc";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "hardhat-tracer";
import {extendEnvironment, HardhatUserConfig, task} from "hardhat/config";
import "solidity-coverage";
import "hardhat-output-validator";
dotenv.config();
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @dev force usage of ethers.js accounts
 */
extendEnvironment(async (env) => {
  // @ts-ignore
  env.accounts = await env.ethers.getSigners();
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  mocha: {
    timeout: 10000,
    fullTrace: true,
  },
  tracer: {
    enabled: true,
    logs: true,
    calls: true,
    gasCost: true,
    sloads: false,
    sstores: false,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
    except: ["ECDSA", "MinimalForwarder"],
  },
  dodoc: {
    runOnCompile: true,
    include: ["tokens", "metatx", "ERC1363"],
    exclude: ["mocks", "elin", "IERC2771Upgradeable"],
    debugMode: false,
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts:
        process.env.MUMBAI_PRIVATE_KEY !== undefined
          ? [process.env.MUMBAI_PRIVATE_KEY]
          : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  outputValidator: {
    runOnCompile: true,
    errorMode: false,
    exclude: ["contracts/mocks"],
  },
};

export default config;
