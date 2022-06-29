import {expect} from "chai";
import {ethers} from "hardhat";

export function unitTestERC2771() {
  describe("======== ERC2771 ========", async function () {
    describe("no trusted forwarder defined", function () {
      it("unrecognize trusted forwarder", async function () {
        await expect(
          await this.token
            .connect(this.signers.recipient)
            .isTrustedForwarder(this.signers.forwarder.address)
        ).to.be.false;
      });

      it(`setting a trusted forwarder should emit "TrustedForwarderChanged"`, async function () {
        await expect(
          await this.token.setTrustedForwarder(this.signers.forwarder.address)
        )
          .to.emit(this.token, "TrustedForwarderChanged")
          .withArgs(
            ethers.constants.AddressZero,
            this.signers.forwarder.address
          );
      });
    });

    describe("a trusted forwarder is defined", function () {
      beforeEach(async function () {
        await this.token.setTrustedForwarder(this.signers.forwarder.address);
      });

      it("recognize trusted forwarder", async function () {
        await expect(
          await this.token
            .connect(this.signers.recipient)
            .isTrustedForwarder(this.signers.forwarder.address)
        ).to.be.true;
      });

      // context("when called directly", function () {
      //   beforeEach(async function () {
      //     this.context = this.signers.recipient; // The Context behavior expects the contract in this.context
      //     this.caller = await ContextMockCaller.new();
      //   });
      //
      //   shouldBehaveLikeRegularContext(...accounts);
      // });
      //
      // context("when receiving a relayed call", function () {
      //   beforeEach(async function () {
      //     this.wallet = Wallet.generate();
      //     this.sender = web3.utils.toChecksumAddress(
      //       this.wallet.getAddressString()
      //     );
      //     this.data = {
      //       types: this.types,
      //       domain: this.domain,
      //       primaryType: "ForwardRequest",
      //     };
      //   });
      //
      //   describe("msgSender", function () {
      //     it("returns the relayed transaction original sender", async function () {
      //       const data = this.signers.recipient.contract.methods
      //         .msgSender()
      //         .encodeABI();
      //
      //       const req = {
      //         from: this.sender,
      //         to: this.signers.recipient.address,
      //         value: "0",
      //         gas: "100000",
      //         nonce: (
      //           await this.signers.forwarder.getNonce(this.sender)
      //         ).toString(),
      //         data,
      //       };
      //
      //       const sign = ethSigUtil.signTypedMessage(
      //         this.wallet.getPrivateKey(),
      //         {data: {...this.data, message: req}}
      //       );
      //       expect(await this.signers.forwarder.verify(req, sign)).to.equal(true);
      //
      //       const {tx} = await this.signers.forwarder.execute(req, sign);
      //       await expectEvent.inTransaction(tx, ERC2771ContextMock, "Sender", {
      //         sender: this.sender,
      //       });
      //     });
      //   });
      //
      //   describe("msgData", function () {
      //     it("returns the relayed transaction original data", async function () {
      //       const integerValue = "42";
      //       const stringValue = "OpenZeppelin";
      //       const data = this.signers.recipient.contract.methods
      //         .msgData(integerValue, stringValue)
      //         .encodeABI();
      //
      //       const req = {
      //         from: this.sender,
      //         to: this.signers.recipient.address,
      //         value: "0",
      //         gas: "100000",
      //         nonce: (
      //           await this.signers.forwarder.getNonce(this.sender)
      //         ).toString(),
      //         data,
      //       };
      //
      //       const sign = ethSigUtil.signTypedMessage(
      //         this.wallet.getPrivateKey(),
      //         {data: {...this.data, message: req}}
      //       );
      //       expect(await this.signers.forwarder.verify(req, sign)).to.equal(true);
      //
      //       const {tx} = await this.signers.forwarder.execute(req, sign);
      //       await expectEvent.inTransaction(tx, ERC2771ContextMock, "Data", {
      //         data,
      //         integerValue,
      //         stringValue,
      //       });
      //     });
      //   });
      // });
    });
  });
}
