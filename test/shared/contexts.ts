import {deployments, ethers} from 'hardhat';
import {Suite} from 'mocha';
import {Signers} from './types';
import {tokens} from './utils';
import 'hardhat-deploy';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
export async function baseContext(description: string, hooks: () => void): Promise<void> {
  /*
    Getting Signers to put them into main Suite Context
   */
  const accounts: SignerWithAddress[] = await ethers.getSigners();
  const signers = {} as Signers;
  signers.owner = accounts[0];
  signers.initialHolder = accounts[1];
  signers.recipient = accounts[2];
  signers.anotherAccount = accounts[3];
  signers.forwarder = accounts[4];
  signers.spender = accounts[5];

  const name = 'METAS';
  const symbol = 'METAS';
  const initialSupply = tokens(5_000_000_000);


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
      await deployments.fixture(['MetaStudioToken']);

      const contract = await ethers.getContract('MetaStudioToken');
      this.token = contract;
    });

    afterEach(async function () {
      if (this.token) {
      }
    });

    hooks();
  });
}
