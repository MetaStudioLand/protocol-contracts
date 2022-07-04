import {expect} from "chai";
import {BigNumber} from "ethers";

export function unitTestPausable(): void {
  describe("======== Contract: Pausable ================================================", async function () {
    describe("transfer", function () {
      it("allows to transfer when unpaused", async function () {
        await this.token
          .connect(this.signers.initialHolder)
          .transfer(this.signers.recipient.address, this.initialSupply);

        expect(
          await this.token.balanceOf(this.signers.initialHolder.address)
        ).to.be.equal("0");
        expect(
          await this.token.balanceOf(this.signers.recipient.address)
        ).to.be.equal(this.initialSupply);
      });

      it("allows to transfer when paused and then unpaused", async function () {
        await this.token.connect(this.signers.initialHolder).pause();
        await this.token.connect(this.signers.initialHolder).unpause();

        await this.token
          .connect(this.signers.initialHolder)
          .transfer(this.signers.recipient.address, this.initialSupply);

        expect(
          await this.token.balanceOf(this.signers.initialHolder.address)
        ).to.be.equal("0");
        expect(
          await this.token.balanceOf(this.signers.recipient.address)
        ).to.be.equal(this.initialSupply);
      });

      it("reverts when trying to transfer when paused", async function () {
        await this.token.connect(this.signers.initialHolder).pause();

        await expect(
          this.token
            .connect(this.signers.initialHolder)
            .transfer(this.signers.recipient.address, this.initialSupply)
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
        ).to.be.equal(this.initialSupply.sub(allowance));
      });

      it("allows to transfer when paused and then unpaused", async function () {
        await this.token.connect(this.signers.initialHolder).pause();
        await this.token.connect(this.signers.initialHolder).unpause();

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
        ).to.be.equal(this.initialSupply.sub(allowance));
      });

      it("reverts when trying to transfer from when paused", async function () {
        await this.token.connect(this.signers.initialHolder).pause();

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
