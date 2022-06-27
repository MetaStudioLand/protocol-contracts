import {expect} from "chai";
import {AbstractContrat} from "../AbstractContract";
import {ZERO_ADDRESS} from "../helpers";

export class Ownable extends AbstractContrat<void> {
  async run() {
    beforeEach(async () => {
      this.token = await this.createToken();
    });

    describe("Ownable", () => {
      it("has an owner", async () => {
        expect(await this.token.owner()).to.equal(this.owner.address);
      });

      describe("transfer ownership", () => {
        it("changes owner after transfer", async () => {
          await expect(
            await this.token
              .connect(this.owner)
              .transferOwnership(this.anotherAccount.address)
          ).to.emit(this.token, "OwnershipTransferred");
          expect(await this.token.owner()).to.equal(
            this.anotherAccount.address
          );
        });

        it("prevents non-owners from transferring", async () => {
          await expect(
            this.token
              .connect(this.anotherAccount)
              .transferOwnership(this.anotherAccount.address)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("guards ownership against stuck state", async () => {
          await expect(
            this.token.connect(this.owner).transferOwnership(ZERO_ADDRESS)
          ).to.be.revertedWith("Ownable: new owner is the zero address");
        });
      });

      describe("renounce ownership", () => {
        it("loses owner after renouncement", async () => {
          await expect(
            await this.token.connect(this.owner).renounceOwnership()
          ).to.emit(this.token, "OwnershipTransferred");
          expect(await this.token.owner()).to.equal(ZERO_ADDRESS);
        });

        it("prevents non-owners from renouncement", async () => {
          await expect(
            this.token.connect(this.anotherAccount).renounceOwnership()
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });
    });
  }
}
