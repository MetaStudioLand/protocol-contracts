import {expect} from "chai";
import {beforeEach} from "mocha";
import {FORWARDER_ROLE, PAUSER_ROLE} from "../shared/constants";
import {getSuiteContext} from "../shared/utils";
import {
  shouldBehaveLikeAccessControl,
  shouldBehaveLikeAccessControlEnumerable,
} from "./behaviors/AccessControl.behavior";

export function unitTestAccessControl(): void {
  describe("======== Contract: AccessControl ================================================", async function () {
    const {signers} = getSuiteContext(this);
    shouldBehaveLikeAccessControl(
      "AccessControl",
      signers.initialHolder,
      signers.owner,
      signers.spender,
      signers.recipient
    );
    shouldBehaveLikeAccessControlEnumerable(
      "AccessControl",
      signers.initialHolder,
      signers.owner,
      signers.spender,
      signers.recipient
    );

    describe("access control for Pause", async function () {
      describe("role is not granted", async function () {
        beforeEach(async function () {
          await this.token
            .connect(this.signers.initialHolder)
            .revokeRole(PAUSER_ROLE, this.signers.spender.address);
        });
        it("pause is disallowed", async function () {
          await expect(
            this.token.connect(this.signers.spender).pause()
          ).to.be.revertedWith(
            `AccessControl: account ${this.signers.spender.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
          );
        });

        it("unpause is disallowed", async function () {
          await expect(
            this.token.connect(this.signers.spender).unpause()
          ).to.be.revertedWith(
            `AccessControl: account ${this.signers.spender.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
          );
        });
      });

      describe("role is granted", async function () {
        beforeEach(async function () {
          await this.token
            .connect(this.signers.initialHolder)
            .grantRole(PAUSER_ROLE, this.signers.spender.address);
        });
        it("pause is allowed", async function () {
          await expect(this.token.connect(this.signers.spender).pause()).to.be
            .not.reverted;
        });

        it("unpause is allowed", async function () {
          this.token.connect(this.signers.initialHolder).pause();
          await expect(this.token.connect(this.signers.spender).unpause()).to.be
            .not.reverted;
        });
      });
    });

    describe("access control for Forwarder", async function () {
      describe("role IS NOT granted", async function () {
        beforeEach(async function () {
          await this.token
            .connect(this.signers.initialHolder)
            .revokeRole(FORWARDER_ROLE, this.signers.spender.address);
        });

        it(`setting a trusted forwarder is not allowed"`, async function () {
          await expect(
            this.token
              .connect(this.signers.spender)
              .setTrustedForwarder(this.signers.forwarder.address)
          ).to.be.revertedWith(
            `AccessControl: account ${this.signers.spender.address.toLowerCase()} is missing role ${FORWARDER_ROLE}`
          );
        });
      });

      describe("role IS granted", async function () {
        beforeEach(async function () {
          await this.token
            .connect(this.signers.initialHolder)
            .grantRole(FORWARDER_ROLE, this.signers.spender.address);
        });

        it(`setting a trusted forwarder is allowed"`, async function () {
          await expect(
            this.token
              .connect(this.signers.spender)
              .setTrustedForwarder(this.signers.forwarder.address)
          ).to.be.not.reverted;
        });
      });
    });
  });
}
