import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers, tracer, upgrades} from "hardhat";
import {Suite} from "mocha";
import {Signers} from "./types";
import {tokens} from "./utils";

export async function baseContext(
  description: string,
  hooks: () => void
): Promise<void> {
  /*
    Getting Signers to put them into main Suite Context
   */
  const accounts: SignerWithAddress[] = await ethers.getSigners();
  const signers = {} as Signers;
  signers.owner = accounts[0];
  tracer.nameTags[signers.owner.address] = "Owner";
  signers.initialHolder = accounts[1];
  tracer.nameTags[signers.initialHolder.address] = "Initial Holder";
  signers.recipient = accounts[2];
  tracer.nameTags[signers.recipient.address] = "Recipient";
  signers.anotherAccount = accounts[3];
  tracer.nameTags[signers.anotherAccount.address] = "Another Account";
  signers.forwarder = accounts[4];
  tracer.nameTags[signers.forwarder.address] = "Forwarder";
  signers.spender = accounts[5];
  tracer.nameTags[signers.spender.address] = "Spender";

  const initialSupply = tokens(5_000_000_000);

  /**
   * Main Suite
   */
  describe(description, function (this: Suite) {
    const rootSuite = this;
    // @ts-ignore
    rootSuite.ctx.signers = signers;
    rootSuite.ctx.initialSupply = initialSupply;

    before(async function () {
      const network = await ethers.provider.getNetwork();
      this.chainId = network.chainId;
      this.signers = signers;
      this.initialSupply = initialSupply;
    });

    beforeEach(async function () {
      const Factory = await ethers.getContractFactory("MetaStudioToken");
      const proxyContract = await upgrades.deployProxy(
        Factory,
        [this.signers.initialHolder.address, ethers.constants.AddressZero],
        {kind: "uups"}
      );
      await proxyContract.deployed();
      this.token = proxyContract;
      tracer.nameTags[this.token.address] = "Contract: MetaStudioToken";
    });

    afterEach(async function () {
      delete tracer.nameTags[this.token.address];
    });

    hooks();
  });
}
