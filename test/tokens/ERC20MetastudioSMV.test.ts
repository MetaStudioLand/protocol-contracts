import { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("ERC20MetastudioSMV contract", function () {
  // Mocha has four functions that let you hook into the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let proxyContract: Contract;
  let logicalContract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  // `beforeEach` will run before each test, re-deploying the contract (Proxied) every time.
  beforeEach(async function () {
    // Gettings addresses
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Get the ContractFactory and Signers here.
    const Factory = await ethers.getContractFactory("ERC20MetastudioSMV");

    // Deploying Proxied version of our Contract and waiting for deployement completed
    proxyContract = await upgrades.deployProxy(Factory);
    await proxyContract.deployed();

    // Deployement should trigger ownership changement `__Ownable_init()`
    // which emit `OwnershipTransferred` event
    await expect(proxyContract.deployTransaction)
      .to.emit(proxyContract, "OwnershipTransferred")
      .withArgs("0x0000000000000000000000000000000000000000", owner.address);

    logicalContract = await ethers.getContractAt(
      "ERC20MetastudioSMV",
      await upgrades.erc1967.getImplementationAddress(proxyContract.address)
    );
    console.log(`logicalContract address: ${logicalContract.address}`);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("Should set the right Proxy's owner", async function () {
      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await proxyContract.owner()).to.equal(owner.address);
    });

    // it("Should set the right Logical's owner", async function () {
    //   // This test expects the owner variable stored in the contract to be equal
    //   // to our Signer's owner.
    //   expect(await logicalContract.owner()).to.equal(owner.address);
    // });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await proxyContract.balanceOf(owner.address);
      expect(await proxyContract.totalSupply())
        .to.equal(ownerBalance)
        .to.equal("5000000000000000000000000000"); // 5000000000.000000000000000000
    });
  });
  /*
  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await proxyContract.transfer(addr1.address, 50);
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
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await proxyContract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await proxyContract.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await proxyContract.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await proxyContract.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await proxyContract.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await proxyContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await proxyContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
*/
});
