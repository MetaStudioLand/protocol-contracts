import {expect} from "chai";
import {ethers} from "hardhat";

export function unitTestOwnable() {
  describe("======== Contract: Ownable ================================================", function () {
    it("has an owner", async function () {
      expect(await this.token.owner()).to.equal(this.signers.owner.address);
    });

    describe("transfer ownership", function () {
      it("changes owner after transfer", async function () {
        await expect(
          await this.token
            .connect(this.signers.owner)
            .transferOwnership(this.signers.anotherAccount.address)
        ).to.emit(this.token, "OwnershipTransferred");
        expect(await this.token.owner()).to.equal(
          this.signers.anotherAccount.address
        );
      });

      it("prevents non-owners from transferring", async function () {
        await expect(
          this.token
            .connect(this.signers.anotherAccount)
            .transferOwnership(this.signers.anotherAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("guards ownership against stuck state", async function () {
        await expect(
          this.token
            .connect(this.signers.owner)
            .transferOwnership(ethers.constants.AddressZero)
        ).to.be.revertedWith("Ownable: new owner is the zero address");
      });
    });

    describe("renounce ownership", function () {
      it("loses owner after renouncement", async function () {
        await expect(
          await this.token.connect(this.signers.owner).renounceOwnership()
        ).to.emit(this.token, "OwnershipTransferred");
        expect(await this.token.owner()).to.equal(ethers.constants.AddressZero);
      });

      it("prevents non-owners from renouncement", async function () {
        await expect(
          this.token.connect(this.signers.anotherAccount).renounceOwnership()
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });
}
