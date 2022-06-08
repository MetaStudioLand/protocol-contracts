# Configuring DEV Env

## Installing Node 16

Install `nvm` (Node Version Manager) Check the following [link](https://github.com/nvm-sh/nvm) for latest version

After installing nvm, use it to install the latest 16th version of `node`

```shell
nvm install 16
```

## Installing Yarn 3 and tools

```shell
npm install -g yarn
yarn set version berry

yarn plugin import interactive-tools
```

## How to upgrade dependencies

```shell
yarn upgrade-interactive
```

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
yarn run hardhat accounts
yarn run hardhat compile
yarn run hardhat clean
yarn run hardhat test
yarn run hardhat node
yarn run hardhat help
REPORT_GAS=true yarn run hardhat test
yarn run hardhat coverage
yarn run hardhat run scripts/deploy.ts
TS_NODE_FILES=true yarn run ts-node scripts/deploy.ts
yarn run eslint '**/*.{js,ts}'
yarn run eslint '**/*.{js,ts}' --fix
yarn run prettier '**/*.{json,sol,md}' --check
yarn run prettier '**/*.{json,sol,md}' --write
yarn run solhint 'contracts/**/*.sol'
yarn run solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
yarn run hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
