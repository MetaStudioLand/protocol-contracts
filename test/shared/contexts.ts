import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {deployments, ethers, tracer} from "hardhat";
import {Suite} from "mocha";
import {Signers} from "./types";
import {tokens} from "./utils";
import  'hardhat-deploy';
export async function baseContext(
  description: string,
  hooks: () => void
): Promise<void> {
  /*
    Getting Signers to put them into main Suite Context
   */
  const accounts: SignerWithAddress[] = await ethers.getSigners();
  const signers = {} as Signers;
  signers.owner = accounts[0];
  tracer.nameTags[signers.owner.address] = "Owner";
  signers.initialHolder = accounts[1];
  tracer.nameTags[signers.initialHolder.address] = "Initial Holder";
  signers.recipient = accounts[2];
  tracer.nameTags[signers.recipient.address] = "Recipient";
  signers.anotherAccount = accounts[3];
  tracer.nameTags[signers.anotherAccount.address] = "Another Account";
  signers.forwarder = accounts[4];
  tracer.nameTags[signers.forwarder.address] = "Forwarder";
  signers.spender = accounts[5];
  tracer.nameTags[signers.spender.address] = "Spender";

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
      const network = await ethers.provider.getNetwork();
      console.log(`network: ${JSON.stringify(network)}`);
      this.chainId = network.chainId;
      this.name = name;
      this.symbol = symbol;
      this.signers = signers;
      this.initialSupply = initialSupply;
    });

    beforeEach(async function () {
      let Factory = await ethers.getContractFactory("MetaStudioToken");
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

    afterEach(async function () {
      if (this.token) {
        delete tracer.nameTags[this.token.address];
      }
    });

    hooks();
  });
}
