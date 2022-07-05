import {expect} from "chai";
import {FORWARDER_ROLE, PAUSER_ROLE} from "./shared/constants";
import {baseContext} from "./shared/contexts";
import {unitTestERC20} from "./test2/10-ERC20.test";
import {unitTestPausable} from "./test2/30-Pausable.test";
import {unitTestERC1363} from "./test2/40-ERC1363.test";
import {unitTestAccessControl} from "./test2/AccessControl.test";
import {unitTestERC165} from "./test2/ERC165.test";
import {unitTestERC20Permit} from "./test2/ERC20Permit.test";
import {unitTestERC2771} from "./test2/ERC2771.test";
import {unitTestVotes} from "./test2/unitTestVotes.test";
baseContext("MetaStudioToken", function () {
  unitTestERC165();
  unitTestERC20();
  unitTestAccessControl();
  unitTestPausable();
  unitTestERC1363();
  unitTestERC2771();
  unitTestVotes();
  unitTestERC20Permit();

  describe("======== MetaStudioToken: Specific tests ================================================", function () {
    describe("AccessControl", function () {
      describe("access control for Pause", function () {
        describe("role is not granted", function () {
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

        describe("role is granted", function () {
          beforeEach(async function () {
            await this.token
              .connect(this.signers.initialHolder)
              .grantRole(PAUSER_ROLE, this.signers.spender.address);
          });
          it("pause is allowed", async function () {
            await expect(
              this.token.connect(this.signers.spender).pause()
            ).to.be.not.reverted;
          });

          it("unpause is allowed", async function () {
            this.token.connect(this.signers.initialHolder).pause();
            await expect(
              this.token.connect(this.signers.spender).unpause()
            ).to.be.not.reverted;
          });
        });
      });

      describe("access control for Forwarder", function () {
        describe("role IS NOT granted", function () {
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

        describe("role IS granted", function () {
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
  });
});
