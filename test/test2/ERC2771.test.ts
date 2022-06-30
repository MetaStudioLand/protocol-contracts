import {expect} from "chai";
import {ethers, tracer} from "hardhat";
import {getSuiteSigners} from "../shared/utils";
import {shouldBehaveLikeRegularERC20} from "./behaviors/ERC2771-ERC20.behavior";

export function unitTestERC2771() {
  describe("======== ERC2771 ========", async function () {
    describe("no trusted forwarder defined", function () {
      it("unrecognize trusted forwarder", async function () {
        await expect(
          await this.token
            .connect(this.signers.recipient)
            .isTrustedForwarder(this.signers.forwarder.address)
        ).to.be.false;
      });

      it(`setting a trusted forwarder should emit "TrustedForwarderChanged"`, async function () {
        await expect(
          await this.token.setTrustedForwarder(this.signers.forwarder.address)
        )
          .to.emit(this.token, "TrustedForwarderChanged")
          .withArgs(
            ethers.constants.AddressZero,
            this.signers.forwarder.address
          );
      });
    });

    describe("a trusted forwarder is defined", function () {
      beforeEach(async function () {
        const Factory = await ethers.getContractFactory("ERC2771Forwarder");
        const minimalForwarder = await Factory.deploy();
        await minimalForwarder.deployed();
        this.minimalForwarder = minimalForwarder;
        tracer.nameTags[this.minimalForwarder.address] =
          "Contract: MinimalForwarder";

        await this.token.setTrustedForwarder(this.minimalForwarder.address);
      });
      afterEach(async function () {
        delete tracer.nameTags[this.minimalForwarder.address];
      });

      it("recognize trusted forwarder", async function () {
        await expect(
          await this.token
            .connect(this.signers.recipient)
            .isTrustedForwarder(this.minimalForwarder.address)
        ).to.be.true;
      });

      const signers = getSuiteSigners(this);
      shouldBehaveLikeRegularERC20(signers.recipient);
    });
  });
}
