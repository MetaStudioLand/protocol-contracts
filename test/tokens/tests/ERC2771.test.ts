// import {expect} from "chai";
import {expect} from "../../../deploy/chai-setup";
import {ethers} from "hardhat";
import {after} from "mocha";
import {getSuiteContext} from "../../shared/utils";
import {shouldBehaveLikeForwardedRegularERC20} from "./behaviors/ERC2771-ERC20.behavior";

export function unitTestERC2771() {
  describe("======== ERC2771 ================================================", function () {
    describe("no trusted forwarder defined", function () {
      it("unrecognize trusted forwarder", async function () {
        await expect(
          await this.token
            .connect(this.signers.recipient)
            .isTrustedForwarder(this.signers.forwarder)
        ).to.be.false;
      });

      it(`setting a trusted forwarder should emit "TrustedForwarderChanged"`, async function () {
        await expect(
          await this.token
            .connect(this.signers.initialHolder)
            .setTrustedForwarder(this.signers.forwarder)
        )
          .to.emit(this.token, "TrustedForwarderChanged")
          .withArgs(ethers.constants.AddressZero, this.signers.forwarder);
      });
    });

    describe("a trusted forwarder is defined", function () {
      before(async function () {
        const Factory = await ethers.getContractFactory("ERC2771ForwarderMock");
        const minimalForwarder = await Factory.deploy();
        await minimalForwarder.deployed();
        this.forwarder = minimalForwarder;
      });
      beforeEach(async function () {
        await this.token
          .connect(this.signers.initialHolder)
          .setTrustedForwarder(this.forwarder.address);
      });

      it("recognize trusted forwarder", async function () {
        await expect(
          await this.token
            .connect(this.signers.recipient)
            .isTrustedForwarder(this.forwarder.address)
        ).to.be.true;
      });

      describe("forwarding ERC20", function () {
        const {signers, initialSupply} = getSuiteContext(this);
        shouldBehaveLikeForwardedRegularERC20(signers, initialSupply);
      });
    });
  });
}
