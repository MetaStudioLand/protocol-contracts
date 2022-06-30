import {expect} from "chai";
import {BigNumber} from "ethers";
import {tokens} from "../shared/utils";

export function unitTestPausable(): void {
  describe("======== Contract: Pausable ================================================", async function () {
    const initialSupply = tokens(5_000_000_000);

    describe("transfer", function () {
      it("allows to transfer when unpaused", async function () {
        await this.token
          .connect(this.signers.initialHolder)
          .transfer(this.signers.recipient.address, initialSupply);

        expect(
          await this.token.balanceOf(this.signers.initialHolder.address)
        ).to.be.equal("0");
        expect(
          await this.token.balanceOf(this.signers.recipient.address)
        ).to.be.equal(initialSupply);
      });

      it("allows to transfer when paused and then unpaused", async function () {
        await this.token.pause();
        await this.token.unpause();

        await this.token
          .connect(this.signers.initialHolder)
          .transfer(this.signers.recipient.address, initialSupply);

        expect(
          await this.token.balanceOf(this.signers.initialHolder.address)
        ).to.be.equal("0");
        expect(
          await this.token.balanceOf(this.signers.recipient.address)
        ).to.be.equal(initialSupply);
      });

      it("reverts when trying to transfer when paused", async function () {
        await this.token.pause();

        await expect(
          this.token
            .connect(this.signers.initialHolder)
            .transfer(this.signers.recipient.address, initialSupply)
        ).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("transfer from", function () {
      const allowance = BigNumber.from(40);

      beforeEach(async function () {
        await this.token
          .connect(this.signers.initialHolder)
          .approve(this.signers.anotherAccount.address, allowance);
      });

      it("allows to transfer from when unpaused", async function () {
        await this.token
          .connect(this.signers.anotherAccount)
          .transferFrom(
            this.signers.initialHolder.address,
            this.signers.recipient.address,
            allowance
          );

        expect(
          await this.token.balanceOf(this.signers.recipient.address)
        ).to.be.equal(allowance);
        expect(
          await this.token.balanceOf(this.signers.initialHolder.address)
        ).to.be.equal(initialSupply.sub(allowance));
      });

      it("allows to transfer when paused and then unpaused", async function () {
        await this.token.pause();
        await this.token.unpause();

        await this.token
          .connect(this.signers.anotherAccount)
          .transferFrom(
            this.signers.initialHolder.address,
            this.signers.recipient.address,
            allowance
          );

        expect(
          await this.token.balanceOf(this.signers.recipient.address)
        ).to.be.equal(allowance);
        expect(
          await this.token.balanceOf(this.signers.initialHolder.address)
        ).to.be.equal(initialSupply.sub(allowance));
      });

      it("reverts when trying to transfer from when paused", async function () {
        await this.token.pause();

        await expect(
          this.token
            .connect(this.signers.anotherAccount)
            .transferFrom(
              this.signers.initialHolder.address,
              this.signers.recipient.address,
              allowance
            )
        ).to.be.revertedWith("Pausable: paused");
      });
    });
  });
}
