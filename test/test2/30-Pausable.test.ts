import {expect} from "chai";
import {BigNumber} from "ethers";
import {ethers, upgrades} from "hardhat";

describe("Pausable", async function () {
  const [holder, recipient, anotherAccount] = await ethers.getSigners();

  const decimals = 18;

  const tokens = function (amount: number): BigNumber {
    return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
  };

  const initialSupply = tokens(5_000_000_000);

  beforeEach(async function () {
    const Factory = await ethers.getContractFactory("MetaStudioToken");

    // Deploying Proxied version of our Contract and waiting for deployement completed
    const proxyContract = await upgrades.deployProxy(
      Factory,
      [holder.address, ethers.constants.AddressZero],
      {kind: "uups"}
    );
    await proxyContract.deployed();
    this.token = proxyContract;
  });

  describe("======== Contract: Pausable ========", async function () {
    describe("transfer", function () {
      it("allows to transfer when unpaused", async function () {
        await this.token
          .connect(holder)
          .transfer(recipient.address, initialSupply);

        expect(await this.token.balanceOf(holder.address)).to.be.equal("0");
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

        expect(await this.token.balanceOf(holder.address)).to.be.equal("0");
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
      const allowance = BigNumber.from(40);

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
  });
});
