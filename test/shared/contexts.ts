import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers, tracer, upgrades} from "hardhat";
import {Suite} from "mocha";
import {Signers} from "./types";

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
  tracer.nameTags[signers.owner.address] = "contractOwner";
  signers.initialHolder = accounts[1];
  tracer.nameTags[signers.initialHolder.address] = "initialHolder";
  signers.recipient = accounts[2];
  tracer.nameTags[signers.recipient.address] = "recipient";
  signers.spender = accounts[2];
  tracer.nameTags[signers.spender.address] = "spender";
  signers.anotherAccount = accounts[3];
  tracer.nameTags[signers.anotherAccount.address] = "anotherAccount";

  /**
   * Main Suite
   */
  describe(description, function (this: Suite) {
    const rootSuite = this;
    // @ts-ignore
    rootSuite.ctx.signers = signers;

    before(async function () {
      this.signers = signers;
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
    });

    hooks();
  });
}
