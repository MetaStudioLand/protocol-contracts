import {expect} from "chai";
import {BigNumber} from "ethers";
import {splitSignature} from "ethers/lib/utils";
import {ethers} from "hardhat";
import {data712} from "../helpers/eip712";
import {waitFor} from "../shared/utils";

export function unitTestERC20Permit(): void {
  describe("======== Contract: ERC20 Permit ================================================", async function () {
    it("initial nonce is 0", async function () {
      expect(
        await this.token.nonces(this.signers.initialHolder.address)
      ).to.be.equal(BigNumber.from("0"));
    });

    it("ERC20 Approval event is emitted when msg signer == owner", async function () {
      const nonce = BigNumber.from("0");
      const deadline = ethers.constants.MaxUint256;

      const approve = {
        owner: this.signers.initialHolder.address,
        spender: this.signers.spender.address,
        value: this.initialSupply._hex,
        nonce: nonce._hex,
        deadline: deadline._hex,
      };

      const permitData712 = data712(
        this.name,
        this.chainId,
        this.token,
        approve
      );
      const flatSig = await ethers.provider.send("eth_signTypedData_v4", [
        this.signers.initialHolder.address,
        permitData712,
      ]);
      const sig = splitSignature(flatSig);

      const receipt = await waitFor(
        this.token.permit(
          this.signers.initialHolder.address,
          this.signers.spender.address,
          this.initialSupply,
          deadline,
          sig.v,
          sig.r,
          sig.s
        )
      );

      expect(receipt)
        .to.emit(this.token, "Approval")
        .withArgs([
          this.signers.initialHolder.address,
          this.signers.spender.address,
          this.initialSupply,
        ]);
    });

    // const version = "1";
    //
    // // const provider = new MockProvider({
    // //   mnemonic: "horn horn horn horn horn horn horn horn horn horn horn horn",
    // //   gasLimit: 9999999,
    // // });
    // // const [wallet, other] = provider.getWallets();
    //
    // beforeEach(async function () {
    //   const Factory = await ethers.getContractFactory("ERC20PermitMock");
    //   const eRC20Permit = await Factory.deploy(
    //     this.name,
    //     this.symbol,
    //     this.signers.initialHolder.address,
    //     this.initialSupply
    //   );
    //   await eRC20Permit.deployed();
    //   this.eRC20Permit = eRC20Permit;
    //   tracer.nameTags[this.eRC20Permit.address] = "Contract: ERC20Permit";
    // });
    //
    // it("initial nonce is 0", async function () {
    //   expect(
    //     await this.token.nonces(this.signers.initialHolder.address)
    //   ).to.be.equal(BigNumber.from("0"));
    // });
    //
    // it("domain separator", async function () {
    //   expect(await this.token.DOMAIN_SEPARATOR()).to.equal(
    //     await domainSeparator(
    //       this.name,
    //       version,
    //       this.chainId,
    //       this.token.address
    //     )
    //   );
    // });
    //
    // // describe("permit", function () {
    // //   // const value = BigNumber.from(42);
    // //   const value = 42;
    // //   const nonce = 0;
    // //   const maxDeadline = ethers.constants.MaxUint256;
    // //
    // //   // const {chainId} = getSuiteContext(this);
    // //   const buildData = (
    // //     spender: string,
    // //     chainId: number,
    // //     verifyingContract: string,
    // //     deadline: BigNumber = maxDeadline
    // //   ) => ({
    // //     primaryType: "Permit",
    // //     types: {EIP712Domain, Permit},
    // //     domain: {name, version, chainId, verifyingContract},
    // //     message: {owner, spender, value, nonce, deadline},
    // //   });
    // //
    // //   it("accepts owner signature", async function () {
    // //     const nonce = await this.token.nonces(wallet.address);
    // //     const digest = await getApprovalDigest(
    // //       this.token,
    // //       {
    // //         owner: wallet.address,
    // //         spender: this.signers.spender.address,
    // //         value: value,
    // //       },
    // //       nonce,
    // //       maxDeadline
    // //     );
    // //
    // //     const {v, r, s} = ecsign(
    // //       Buffer.from(digest.slice(2), "hex"),
    // //       Buffer.from(wallet.privateKey.slice(2), "hex")
    // //     );
    // //
    // //     await expect(
    // //       this.token.permit(
    // //         wallet.address,
    // //         this.signers.spender.address,
    // //         value,
    // //         maxDeadline,
    // //         v,
    // //         hexlify(r),
    // //         hexlify(s)
    // //       )
    // //     )
    // //       .to.emit(this.token, "Approval")
    // //       .withArgs(wallet.address, this.signers.spender.address, value);
    // //     expect(
    // //       await this.token.allowance(
    // //         wallet.address,
    // //         this.signers.spender.address
    // //       )
    // //     ).to.eq(value);
    // //     expect(await this.token.nonces(wallet.address)).to.eq(1);
    // //     // const data = buildData(
    // //     //   this.signers.spender.address,
    // //     //   this.chainId,
    // //     //   this.token.address
    // //     // );
    // //     //
    // //     // const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
    // //     //   // @ts-ignore
    // //     //   data,
    // //     // });
    // //     // const {v, r, s} = fromRpcSig(signature);
    // //     //
    // //     // const tx = await this.token.permit(
    // //     //   this.signers.owner.address,
    // //     //   this.signers.spender.address,
    // //     //   value,
    // //     //   maxDeadline,
    // //     //   v,
    // //     //   r,
    // //     //   s
    // //     // );
    // //     // await tx.wait();
    // //     //
    // //     // expect(await this.token.nonces(this.signers.owner.address)).to.be.equal(
    // //     //   BigNumber.from("1")
    // //     // );
    // //     // expect(
    // //     //   await this.token.allowance(
    // //     //     this.signers.owner.address,
    // //     //     this.signers.spender.address
    // //     //   )
    // //     // ).to.be.equal(value);
    // //   });
    // //
    // //   // it("rejects reused signature", async function () {
    // //   //   const data = buildData(this.chainId, this.token.address);
    // //   //   const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
    // //   //     data,
    // //   //   });
    // //   //   const {v, r, s} = fromRpcSig(signature);
    // //   //
    // //   //   await this.token.permit(owner, spender, value, maxDeadline, v, r, s);
    // //   //
    // //   //   await expectRevert(
    // //   //     this.token.permit(owner, spender, value, maxDeadline, v, r, s),
    // //   //     "ERC20Permit: invalid signature"
    // //   //   );
    // //   // });
    // //   //
    // //   // it("rejects other signature", async function () {
    // //   //   const otherWallet = Wallet.generate();
    // //   //   const data = buildData(this.chainId, this.token.address);
    // //   //   const signature = ethSigUtil.signTypedMessage(
    // //   //     otherWallet.getPrivateKey(),
    // //   //     {data}
    // //   //   );
    // //   //   const {v, r, s} = fromRpcSig(signature);
    // //   //
    // //   //   await expectRevert(
    // //   //     this.token.permit(owner, spender, value, maxDeadline, v, r, s),
    // //   //     "ERC20Permit: invalid signature"
    // //   //   );
    // //   // });
    // //   //
    // //   // it("rejects expired permit", async function () {
    // //   //   const deadline = (await time.latest()) - time.duration.weeks(1);
    // //   //
    // //   //   const data = buildData(this.chainId, this.token.address, deadline);
    // //   //   const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
    // //   //     data,
    // //   //   });
    // //   //   const {v, r, s} = fromRpcSig(signature);
    // //   //
    // //   //   await expectRevert(
    // //   //     this.token.permit(owner, spender, value, deadline, v, r, s),
    // //   //     "ERC20Permit: expired deadline"
    // //   //   );
    // //   // });
    // });
  });
}
