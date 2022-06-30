import {expect} from "chai";
import {BigNumber} from "ethers";
import {ethers, tracer} from "hardhat";
import {getSuiteContext} from "../shared/utils";

// const ethSigUtil = require("eth-sig-util");
// const Wallet = require("ethereumjs-wallet").default;

const {EIP712Domain, Permit, domainSeparator} = require("../helpers/eip712");

export function unitTestERC20Permit(): void {
  describe("======== Contract: ERC20 Permit ================================================", async function () {
    const version = "1";

    const {name, symbol, initialSupply} = getSuiteContext(this);

    beforeEach(async function () {
      const Factory = await ethers.getContractFactory("ERC20PermitMock");
      const eRC20Permit = await Factory.deploy(
        name,
        symbol,
        this.signers.initialHolder.address,
        initialSupply
      );
      await eRC20Permit.deployed();
      this.eRC20Permit = eRC20Permit;
      tracer.nameTags[this.eRC20Permit.address] = "Contract: ERC20Permit";
    });

    it("initial nonce is 0", async function () {
      expect(
        await this.token.nonces(this.signers.initialHolder.address)
      ).to.be.equal(BigNumber.from("0"));
    });

    it("domain separator", async function () {
      expect(await this.token.DOMAIN_SEPARATOR()).to.equal(
        await domainSeparator(name, version, this.chainId, this.token.address)
      );
    });

    // describe("permit", function () {
    //   const wallet = Wallet.generate();
    //
    //   const owner = wallet.getAddressString();
    //   const value = new BN(42);
    //   const nonce = 0;
    //   const maxDeadline = MAX_UINT256;
    //
    //   const buildData = (
    //     chainId,
    //     verifyingContract,
    //     deadline = maxDeadline
    //   ) => ({
    //     primaryType: "Permit",
    //     types: {EIP712Domain, Permit},
    //     domain: {name, version, chainId, verifyingContract},
    //     message: {owner, spender, value, nonce, deadline},
    //   });
    //
    //   it("accepts owner signature", async function () {
    //     const data = buildData(this.chainId, this.token.address);
    //     const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
    //       data,
    //     });
    //     const {v, r, s} = fromRpcSig(signature);
    //
    //     const receipt = await this.token.permit(
    //       owner,
    //       spender,
    //       value,
    //       maxDeadline,
    //       v,
    //       r,
    //       s
    //     );
    //
    //     expect(await this.token.nonces(owner)).to.be.bignumber.equal("1");
    //     expect(
    //       await this.token.allowance(owner, spender)
    //     ).to.be.bignumber.equal(value);
    //   });
    //
    //   it("rejects reused signature", async function () {
    //     const data = buildData(this.chainId, this.token.address);
    //     const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
    //       data,
    //     });
    //     const {v, r, s} = fromRpcSig(signature);
    //
    //     await this.token.permit(owner, spender, value, maxDeadline, v, r, s);
    //
    //     await expectRevert(
    //       this.token.permit(owner, spender, value, maxDeadline, v, r, s),
    //       "ERC20Permit: invalid signature"
    //     );
    //   });
    //
    //   it("rejects other signature", async function () {
    //     const otherWallet = Wallet.generate();
    //     const data = buildData(this.chainId, this.token.address);
    //     const signature = ethSigUtil.signTypedMessage(
    //       otherWallet.getPrivateKey(),
    //       {data}
    //     );
    //     const {v, r, s} = fromRpcSig(signature);
    //
    //     await expectRevert(
    //       this.token.permit(owner, spender, value, maxDeadline, v, r, s),
    //       "ERC20Permit: invalid signature"
    //     );
    //   });
    //
    //   it("rejects expired permit", async function () {
    //     const deadline = (await time.latest()) - time.duration.weeks(1);
    //
    //     const data = buildData(this.chainId, this.token.address, deadline);
    //     const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
    //       data,
    //     });
    //     const {v, r, s} = fromRpcSig(signature);
    //
    //     await expectRevert(
    //       this.token.permit(owner, spender, value, deadline, v, r, s),
    //       "ERC20Permit: expired deadline"
    //     );
    //   });
    // });
  });
}
