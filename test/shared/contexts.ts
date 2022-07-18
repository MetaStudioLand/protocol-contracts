import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import {deployments, ethers, tracer} from 'hardhat';
import 'hardhat-deploy';
import {Suite} from 'mocha';
import {Signers} from './types';
import {tokens} from './utils';

export async function baseContext(description: string, hooks: () => void): Promise<void> {
  /*
    Getting Signers to put them into main Suite Context
   */
  const accounts: SignerWithAddress[] = await ethers.getSigners();
  const signers = {} as Signers;
  signers.owner = accounts[0];
  tracer.nameTags[signers.owner.address] = 'Deployer';
  signers.initialHolder = accounts[1];
  tracer.nameTags[signers.initialHolder.address] = 'Initial Holder';
  signers.recipient = accounts[2];
  tracer.nameTags[signers.recipient.address] = 'Recipient';
  signers.anotherAccount = accounts[3];
  tracer.nameTags[signers.anotherAccount.address] = 'Another Account';
  signers.forwarder = accounts[4];
  tracer.nameTags[signers.forwarder.address] = 'Forwarder';
  signers.spender = accounts[5];
  tracer.nameTags[signers.spender.address] = 'Spender';

  const name = 'METAS';
  const symbol = 'METAS';
  const initialSupply = tokens(5_000_000_000);

  /**
   * Main Suite
   */
  describe(description, function (this: Suite) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const rootSuite = this;
    rootSuite.ctx.signers = signers;
    rootSuite.ctx.name = name;
    rootSuite.ctx.symbol = symbol;
    rootSuite.ctx.initialSupply = initialSupply;

    before(async function () {
      const network = await ethers.provider.getNetwork();
      this.chainId = network.chainId;
      this.name = name;
      this.symbol = symbol;
      this.signers = signers;
      this.initialSupply = initialSupply;
    });

    beforeEach(async function () {
      await deployments.fixture(['MetaStudioToken'], {keepExistingDeployments: false});

      this.token = await ethers.getContract('MetaStudioToken');
      tracer.nameTags[this.token.address] = 'Contract:MetaStudioToken';
    });

    afterEach(async function () {
      if (this.token) {
        delete tracer.nameTags[this.token.address];
      }
    });

    hooks();
  });
}
