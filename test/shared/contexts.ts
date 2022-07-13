import {deployments, ethers, getNamedAccounts} from "hardhat";
import {Suite} from "mocha";
import {Signers} from "./types";
import {tokens} from "./utils";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";

export async function baseContext(
  description: string,
  hooks: () => void
): Promise<void> {
  /*
    Getting Signers to put them into main Suite Context
   */
  const accounts = await getNamedAccounts();
  const signers = {} as Signers;
  signers.owner = accounts[0];
  signers.initialHolder = accounts[1];
  signers.recipient = accounts[2];
  signers.anotherAccount = accounts[3];
  signers.forwarder = accounts[4];
  signers.spender = accounts[5];

  const name = "METAS";
  const symbol = "METAS";
  const initialSupply = tokens(5_000_000_000);
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");
  /**
   * Main Suite
   */
  describe(description, function (this: Suite) {
    const rootSuite = this;
    // @ts-ignore
    rootSuite.ctx.signers = signers;
    rootSuite.ctx.name = name;
    rootSuite.ctx.symbol = symbol;
    rootSuite.ctx.initialSupply = initialSupply;

    before(async function () {
      const network = await ethers.getDefaultProvider().getNetwork();
      console.log(`network: ${JSON.stringify(network)}`);
      this.chainId = network.chainId;
      this.name = name;
      this.symbol = symbol;
      this.signers = signers;
      this.initialSupply = initialSupply;
    });

    beforeEach(async function () {
      const Factory = await ethers.getContractFactory("MetaStudioToken");
      //     const [deployer] = await ethers.getSigners();
      // const MetaStudioToken = await ethers.getContractFactory(
      //   "MetaStudioToken",
      //   deployer
      // );
      // console.log("Processing");

      await deployments.fixture(["MetaStudioToken"]);

      // const {deployments, getNamedAccounts} = hre;
      // const {deploy} = deployments.de;
      // await deployments.fixture(["MetaStudioToken"]);
      // await Factory.deploy()

      // let Factory = await ethers.getContractFactory("MetaStudioToken");
      //   const mc = await upgrades.deployProxy("MetaStudioToken", [this.signers.initialHolder.address, ethers.constants.AddressZero]);

      //   await mc.deployed();
      const myContract = await deployments.get("MetaStudioToken");

      const contract = await ethers.getContractAt(
        "MetaStudioToken",
        myContract.address
      );

      // console.log("_-_-_-_-_-_-_-__-_-_-_-");
      // console.log(await contract.decimals());
      // console.log("________------------_");

      //  const contract = await ethers.getContractAt(
      //   "MetaStudioToken"
      //       deployment.address
      //     );
      // console.log("OK");

      // let Factory = await ethers.getContractFactory("MetaStudioToken");
      // const mc = await upgrades.deployProxy(MetaStudioToken, [this.signers.initialHolder.address, ethers.constants.AddressZero]);

      // await mc.deployed();
      // const proxyContract = await deploy(Factory, [this.signers.initialHolder.address, ethers.constants.AddressZero], {kind: "uups"} );
      // console.log("---------------------------------");

      // console.log(proxyContract);

      // let factoryDeployed = await  Factory.deploy()

      // const proxyContract = await  upgrades.deployProxy(
      //   Factory,
      //   [this.signers.initialHolder.address, ethers.constants.AddressZero],
      //   {kind: "uups"}
      // );

      // await factoryDeployed.deployed();
      // console.log("---_______-------");
      //  await deploy(Factory, {
      //     proxy:  true ,
      //     args: [this.signers.initialHolder.address, ethers.constants.AddressZero],

      //     log:true
      //   });

      // console.log("_______-------");

      // console.log(deployResult);

      // console.log(
      //   `contract Sale deployed at ${deployResult.address} using ${deployResult.txHash} gas ${deployResult.deployTransaction}`
      // );

      // f.
      this.token = contract;

      // tracer.nameTags[this.token.address] = "Contract: METAS";
    });

    hooks();
  });
}
