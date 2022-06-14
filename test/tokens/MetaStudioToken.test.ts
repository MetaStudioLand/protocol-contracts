/* eslint-disable prettier/prettier */
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {Contract} from "ethers";
import {ethers, network, run, tracer, upgrades} from "hardhat";
import {doTransfert} from "../utils/ERC20.utils";

describe("MetaStudioToken", function () {
  let proxyContract: Contract;
  let logicalContract: Contract;
  let owner: SignerWithAddress;
  let tokensOwner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  tracer.nameTags[ethers.constants.AddressZero] = "Void0";
  tracer.nameTags["0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24"] = "ERC1820";

  // `beforeEach` will run before each test, re-deploying the contract (Proxied) every time.
  beforeEach(async function () {
    // Reset the local Network (blockchain)
    await network.provider.send("hardhat_reset");
    // Redeploying mocked ERC1820
    await run("test:setup-test-environment");

    // Gettings addresses
    [owner, tokensOwner, addr1, addr2] = await ethers.getSigners();
    tracer.nameTags[owner.address] = "owner";
    tracer.nameTags[tokensOwner.address] = "tokensOwner";
    tracer.nameTags[addr1.address] = "addr1";
    tracer.nameTags[addr2.address] = "addr2";

    // Get the ContractFactory and Signers here.
    const Factory = await ethers.getContractFactory("MetaStudioToken");

    // Deploying Proxied version of our Contract and waiting for deployement completed
    proxyContract = await upgrades.deployProxy(
      Factory,
      [tokensOwner.address, ethers.constants.AddressZero, []],
      {kind: "uups"}
    );
    await proxyContract.deployed();
    tracer.nameTags[proxyContract.address] = "proxyContract";

    // Deployement should trigger ownership changement `__Ownable_init()`
    // which emit `OwnershipTransferred` event
    await expect(proxyContract.deployTransaction)
      .to.emit(proxyContract, "OwnershipTransferred")
      .withArgs(ethers.constants.AddressZero, owner.address);

    // Getting implementation contract
    logicalContract = await ethers.getContractAt(
      "MetaStudioToken",
      await upgrades.erc1967.getImplementationAddress(proxyContract.address)
    );
    tracer.nameTags[logicalContract.address] = "logicalContract";

    // Le propriétaire du Logical Contract should be "Nobody" (VoidSigner) => no transaction can be issued by it
    expect(await logicalContract.owner()).to.equal(
      ethers.constants.AddressZero
    );
  });

  /*
   * Test to verify good deployement (owner and co)
   */
  describe("Deployment", function () {
    it("Should set the right Proxy's owner", async function () {
      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await proxyContract.owner()).to.equal(owner.address);
    });

    it("Owner balance shoud be 0", async function () {
      expect(await proxyContract.balanceOf(owner.address)).to.equal(0);
    });

    it("Should assign the total supply of tokens to the tokensOwner", async function () {
      const tokensOwnerBalance = await proxyContract.balanceOf(
        tokensOwner.address
      );
      expect(await proxyContract.totalSupply())
        .to.equal(tokensOwnerBalance)
        .to.equal(ethers.utils.parseUnits("5000000000"));
    });
  });

  /*
   * Test for every impossible task done on Logical Contract
   */
  describe("Failing when called on Logical Contract", function () {
    it("Transfert: Should fail because no token owned", async function () {
      const initialOwnerBalance = await logicalContract.balanceOf(
        owner.address
      );

      // Try to send 1 token from owner (0 token) to addr1 (0 token).
      // `require` will evaluate false and revert the transaction.
      await expect(
        logicalContract.transfer(addr1.address, 1)
      ).to.be.revertedWith("ERC777: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await logicalContract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Pause: Should fail", async function () {
      // Try to pause contract
      // `require` will evaluate false and revert the transaction.
      await expect(logicalContract.pause()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
      await expect(
        logicalContract.connect(ethers.constants.AddressZero).pause()
      ).to.be.reverted;
    });

    it("Transfert Ownership: Should fail", async function () {
      // Try to transfert Ownership contract
      // `require` will evaluate false and revert the transaction.
      await expect(
        logicalContract.transferOwnership(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await expect(
        logicalContract
          .connect(ethers.constants.AddressZero)
          .transferOwnership(addr2.address)
      ).to.be.reverted;
    });
  });

  describe("Pausable contract", function () {
    it("Transfer from Paused contract should fail", async function () {
      // Pause ok
      await proxyContract.pause();

      // Try to send 100 on pause contract
      // `require` will evaluate false and revert the transaction.
      await expect(
        proxyContract.connect(tokensOwner).transfer(addr1.address, 100)
      ).to.be.revertedWith("Pausable: paused");

      // Pause ok
      await proxyContract.unpause();

      await doTransfert(proxyContract, tokensOwner, addr1, 200);
    });
  });

  /*
   * Passage de transactions
   */
  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await proxyContract.connect(tokensOwner).transfer(addr1.address, 50);
      const addr1Balance = await proxyContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await proxyContract.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await proxyContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await proxyContract.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        proxyContract.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC777: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await proxyContract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await proxyContract.balanceOf(
        tokensOwner.address
      );

      // Transfer 100 tokens from owner to addr1.
      await proxyContract.connect(tokensOwner).transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await proxyContract.connect(tokensOwner).transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await proxyContract.balanceOf(
        tokensOwner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await proxyContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await proxyContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
