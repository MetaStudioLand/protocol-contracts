// import {expect} from "chai";
// import {MockProvider} from "ethereum-waffle";
// import {ecsign} from "ethereumjs-util";
// import {BigNumber} from "ethers";
// import {hexlify} from "ethers/lib/utils";
// import {ethers, tracer} from "hardhat";
// import {getSuiteContext} from "../shared/utils";
//
// const {EIP712Domain, Permit, domainSeparator} = require("../helpers/eip712");
//
// export function unitTestERC20Permit(): void {
//   describe("======== Contract: ERC20 Permit ================================================", async function () {
//     const version = "1";
//
//     const provider = new MockProvider({
//       mnemonic: "horn horn horn horn horn horn horn horn horn horn horn horn",
//       gasLimit: 9999999,
//     });
//     const [wallet, other] = provider.getWallets();
//
//     const {name, symbol, initialSupply} = getSuiteContext(this);
//
//     beforeEach(async function () {
//       const Factory = await ethers.getContractFactory("ERC20PermitMock");
//       const eRC20Permit = await Factory.deploy(
//         name,
//         symbol,
//         this.signers.initialHolder.address,
//         initialSupply
//       );
//       await eRC20Permit.deployed();
//       this.eRC20Permit = eRC20Permit;
//       tracer.nameTags[this.eRC20Permit.address] = "Contract: ERC20Permit";
//     });
//
//     it("initial nonce is 0", async function () {
//       expect(
//         await this.token.nonces(this.signers.initialHolder.address)
//       ).to.be.equal(BigNumber.from("0"));
//     });
//
//     it("domain separator", async function () {
//       expect(await this.token.DOMAIN_SEPARATOR()).to.equal(
//         await domainSeparator(name, version, this.chainId, this.token.address)
//       );
//     });
//
//     describe("permit", function () {
//       // const value = BigNumber.from(42);
//       const value = 42;
//       const nonce = 0;
//       const maxDeadline = ethers.constants.MaxUint256;
//
//       // const {chainId} = getSuiteContext(this);
//       const buildData = (
//         spender: string,
//         chainId: number,
//         verifyingContract: string,
//         deadline: BigNumber = maxDeadline
//       ) => ({
//         primaryType: "Permit",
//         types: {EIP712Domain, Permit},
//         domain: {name, version, chainId, verifyingContract},
//         message: {owner, spender, value, nonce, deadline},
//       });
//
//       it("accepts owner signature", async function () {
//         const nonce = await this.token.nonces(wallet.address);
//         const digest = await getApprovalDigest(
//           this.token,
//           {
//             owner: wallet.address,
//             spender: this.signers.spender.address,
//             value: value,
//           },
//           nonce,
//           maxDeadline
//         );
//
//         const {v, r, s} = ecsign(
//           Buffer.from(digest.slice(2), "hex"),
//           Buffer.from(wallet.privateKey.slice(2), "hex")
//         );
//
//         await expect(
//           this.token.permit(
//             wallet.address,
//             this.signers.spender.address,
//             value,
//             maxDeadline,
//             v,
//             hexlify(r),
//             hexlify(s)
//           )
//         )
//           .to.emit(this.token, "Approval")
//           .withArgs(wallet.address, this.signers.spender.address, value);
//         expect(
//           await this.token.allowance(
//             wallet.address,
//             this.signers.spender.address
//           )
//         ).to.eq(value);
//         expect(await this.token.nonces(wallet.address)).to.eq(1);
//         // const data = buildData(
//         //   this.signers.spender.address,
//         //   this.chainId,
//         //   this.token.address
//         // );
//         //
//         // const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
//         //   // @ts-ignore
//         //   data,
//         // });
//         // const {v, r, s} = fromRpcSig(signature);
//         //
//         // const tx = await this.token.permit(
//         //   this.signers.owner.address,
//         //   this.signers.spender.address,
//         //   value,
//         //   maxDeadline,
//         //   v,
//         //   r,
//         //   s
//         // );
//         // await tx.wait();
//         //
//         // expect(await this.token.nonces(this.signers.owner.address)).to.be.equal(
//         //   BigNumber.from("1")
//         // );
//         // expect(
//         //   await this.token.allowance(
//         //     this.signers.owner.address,
//         //     this.signers.spender.address
//         //   )
//         // ).to.be.equal(value);
//       });
//
//       // it("rejects reused signature", async function () {
//       //   const data = buildData(this.chainId, this.token.address);
//       //   const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
//       //     data,
//       //   });
//       //   const {v, r, s} = fromRpcSig(signature);
//       //
//       //   await this.token.permit(owner, spender, value, maxDeadline, v, r, s);
//       //
//       //   await expectRevert(
//       //     this.token.permit(owner, spender, value, maxDeadline, v, r, s),
//       //     "ERC20Permit: invalid signature"
//       //   );
//       // });
//       //
//       // it("rejects other signature", async function () {
//       //   const otherWallet = Wallet.generate();
//       //   const data = buildData(this.chainId, this.token.address);
//       //   const signature = ethSigUtil.signTypedMessage(
//       //     otherWallet.getPrivateKey(),
//       //     {data}
//       //   );
//       //   const {v, r, s} = fromRpcSig(signature);
//       //
//       //   await expectRevert(
//       //     this.token.permit(owner, spender, value, maxDeadline, v, r, s),
//       //     "ERC20Permit: invalid signature"
//       //   );
//       // });
//       //
//       // it("rejects expired permit", async function () {
//       //   const deadline = (await time.latest()) - time.duration.weeks(1);
//       //
//       //   const data = buildData(this.chainId, this.token.address, deadline);
//       //   const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
//       //     data,
//       //   });
//       //   const {v, r, s} = fromRpcSig(signature);
//       //
//       //   await expectRevert(
//       //     this.token.permit(owner, spender, value, deadline, v, r, s),
//       //     "ERC20Permit: expired deadline"
//       //   );
//       // });
//     });
//   });
// }
