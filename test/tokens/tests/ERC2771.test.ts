// import {expect} from "chai";
import {expect} from 'chai';
import {ethers, tracer} from 'hardhat';
import {getSuiteContext} from '../../shared/utils';
import {shouldBehaveLikeForwardedRegularERC20} from './behaviors/ERC2771-ERC20.behavior';

export function unitTestERC2771() {
  describe('======== ERC2771 ================================================', function () {
    describe('no trusted forwarder defined', function () {
      it('unrecognize trusted forwarder', async function () {
        await expect(
          await this.token.connect(this.signers.recipient).isTrustedForwarder(this.signers.forwarder.address)
        ).to.be.false;
      });

      it(`setting a trusted forwarder should emit "TrustedForwarderChanged"`, async function () {
        await expect(this.token.connect(this.signers.initialHolder).setTrustedForwarder(this.signers.forwarder.address))
          .to.emit(this.token, 'TrustedForwarderChanged')
          .withArgs(ethers.constants.AddressZero, this.signers.forwarder.address);
      });
    });

    describe('a trusted forwarder is defined', function () {
      beforeEach(async function () {
        const Factory = await ethers.getContractFactory('ERC2771ForwarderMock');
        const minimalForwarder = await Factory.deploy();
        await minimalForwarder.deployed();
        this.forwarder = minimalForwarder;
        tracer.nameTags[this.forwarder.address] = 'Contract:ERC2771Forwarder';
        // Affectation du trusted forwarder
        await this.token.connect(this.signers.initialHolder).setTrustedForwarder(this.forwarder.address);
      });
      afterEach(function () {
        if (this.forwarder) {
          delete tracer.nameTags[this.forwarder.address];
        }
      });

      it('recognize trusted forwarder', async function () {
        await expect(await this.token.connect(this.signers.recipient).isTrustedForwarder(this.forwarder.address)).to.be
          .true;
      });

      describe('forwarding ERC20', function () {
        const {signers, initialSupply} = getSuiteContext(this);
        shouldBehaveLikeForwardedRegularERC20(signers, initialSupply);
      });
    });
  });
}
