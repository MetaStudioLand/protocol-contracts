import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber} from "ethers";
import {toBN} from "../../../helpers";

export async function shouldBehaveLikeERC20Pausable(
  initialSupply: BigNumber,
  holder: SignerWithAddress,
  recipient: SignerWithAddress,
  anotherAccount: SignerWithAddress
) {
  describe("pausable token", function () {
    describe("transfer", function () {
      it("allows to transfer when unpaused", async function () {
        await this.token
          .connect(holder)
          .transfer(recipient.address, initialSupply);

        expect(await this.token.balanceOf(holder.address)).to.be.equal(0);
        expect(await this.token.balanceOf(recipient.address)).to.be.equal(
          initialSupply
        );
      });

      it("allows to transfer when paused and then unpaused", async function () {
        await this.token.pause();
        await this.token.unpause();

        await this.token
          .connect(holder)
          .transfer(recipient.address, initialSupply);

        expect(await this.token.balanceOf(holder.address)).to.be.equal(0);
        expect(await this.token.balanceOf(recipient.address)).to.be.equal(
          initialSupply
        );
      });

      it("reverts when trying to transfer when paused", async function () {
        await this.token.pause();

        await expect(
          this.token.connect(holder).transfer(recipient.address, initialSupply)
        ).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("transfer from", function () {
      const allowance = toBN(40);

      beforeEach(async function () {
        await this.token
          .connect(holder)
          .approve(anotherAccount.address, allowance);
      });

      it("allows to transfer from when unpaused", async function () {
        await this.token
          .connect(anotherAccount)
          .transferFrom(holder.address, recipient.address, allowance);

        expect(await this.token.balanceOf(recipient.address)).to.be.equal(
          allowance
        );
        expect(await this.token.balanceOf(holder.address)).to.be.equal(
          initialSupply.sub(allowance)
        );
      });

      it("allows to transfer when paused and then unpaused", async function () {
        await this.token.pause();
        await this.token.unpause();

        await this.token
          .connect(anotherAccount)
          .transferFrom(holder.address, recipient.address, allowance);

        expect(await this.token.balanceOf(recipient.address)).to.be.equal(
          allowance
        );
        expect(await this.token.balanceOf(holder.address)).to.be.equal(
          initialSupply.sub(allowance)
        );
      });

      it("reverts when trying to transfer from when paused", async function () {
        await this.token.pause();

        await expect(
          this.token
            .connect(anotherAccount)
            .transferFrom(holder.address, recipient.address, allowance)
        ).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("mint", function () {
      const amount = toBN("42");

      it("allows to mint when unpaused", async function () {
        await this.token.mint(recipient.address, amount);

        expect(await this.token.balanceOf(recipient.address)).to.be.equal(
          amount
        );
      });

      it("allows to mint when paused and then unpaused", async function () {
        await this.token.pause();
        await this.token.unpause();

        await this.token.mint(recipient.address, amount);

        expect(await this.token.balanceOf(recipient.address)).to.be.equal(
          amount
        );
      });

      it("reverts when trying to mint when paused", async function () {
        await this.token.pause();

        await expect(
          this.token.mint(recipient.address, amount)
        ).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("burn", function () {
      const amount = toBN("42");

      it("allows to burn when unpaused", async function () {
        await this.token.burn(holder.address, amount);

        expect(await this.token.balanceOf(holder.address)).to.be.equal(
          initialSupply.sub(amount)
        );
      });

      it("allows to burn when paused and then unpaused", async function () {
        await this.token.pause();
        await this.token.unpause();

        await this.token.burn(holder.address, amount);

        expect(await this.token.balanceOf(holder.address)).to.be.equal(
          initialSupply.sub(amount)
        );
      });

      it("reverts when trying to burn when paused", async function () {
        await this.token.pause();

        await expect(
          this.token.burn(holder.address, amount)
        ).to.be.revertedWith("Pausable: paused");
      });
    });
  });
}
