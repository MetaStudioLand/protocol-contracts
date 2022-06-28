import {expect} from "chai";
import {ethers, upgrades} from "hardhat";

describe("Ownable", async function () {
  const [owner, anotherAccount] = await ethers.getSigners();

  beforeEach(async function () {
    const Factory = await ethers.getContractFactory("MetaStudioToken");

    // Deploying Proxied version of our Contract and waiting for deployement completed
    const proxyContract = await upgrades.deployProxy(
      Factory,
      [owner.address, ethers.constants.AddressZero, []],
      {kind: "uups"}
    );
    await proxyContract.deployed();

    this.token = proxyContract;
  });

  it("has an owner", async function () {
    expect(await this.token.owner()).to.equal(owner.address);
  });

  describe("======== Contract: Ownable ========", async function () {
    describe("transfer ownership", function () {
      it("changes owner after transfer", async function () {
        await expect(
          await this.token
            .connect(owner)
            .transferOwnership(anotherAccount.address)
        ).to.emit(this.token, "OwnershipTransferred");
        expect(await this.token.owner()).to.equal(anotherAccount.address);
      });

      it("prevents non-owners from transferring", async function () {
        await expect(
          this.token
            .connect(anotherAccount)
            .transferOwnership(anotherAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("guards ownership against stuck state", async function () {
        await expect(
          this.token
            .connect(owner)
            .transferOwnership(ethers.constants.AddressZero)
        ).to.be.revertedWith("Ownable: new owner is the zero address");
      });
    });

    describe("renounce ownership", function () {
      it("loses owner after renouncement", async function () {
        await expect(
          await this.token.connect(owner).renounceOwnership()
        ).to.emit(this.token, "OwnershipTransferred");
        expect(await this.token.owner()).to.equal(ethers.constants.AddressZero);
      });

      it("prevents non-owners from renouncement", async function () {
        await expect(
          this.token.connect(anotherAccount).renounceOwnership()
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });
});
