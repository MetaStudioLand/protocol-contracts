import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";

export async function shouldBehaveLikeRegularContext(
  sender: SignerWithAddress
) {
  describe("msgSender", function () {
    it("returns the transaction sender when called from an EOA", async function () {
      await expect(await this.context.connect(sender).msgSender()).to.be.equals(
        sender.address
      );
    });

    // it("returns the transaction sender when from another contract", async function () {
    //   // logNameTags();
    //   const data = functionCallEncodeABI("msgSender", "");
    //   const req = {
    //     from: sender.address,
    //     to: this.context.address,
    //     value: ethers.utils.parseEther("1"),
    //     gas: "100000",
    //     nonce: (
    //       await this.minimalForwarder.getNonce(sender.address)
    //     ).toString(),
    //     data,
    //   };
    //
    //   // const signature = await sender._signTypedData(
    //   //   {name: "MinimalForwarder", version: "0.0.1"},
    //   //   types,
    //   //   req
    //   // ); // domain, types according to EIP-2771 docs
    //   // expect(await this.minimalForwarder.verify(req, signature)).to.be.equal(true);
    //   // const tx = await this.minimalForwarder.executeWithoutSignature(req);
    //   // console.log(`tx: ${util.inspect(tx)}`);
    //   // const rc = await tx.wait();
    //   // console.log(`rc.events: ${JSON.stringify(rc)}`);
    //
    //   const tx = await this.minimalForwarder.executeWithoutSignature(req);
    //   // console.log(`tx: ${util.inspect(tx)}`);
    //   const rc = await tx.wait();
    //   console.log(`rc: ${util.inspect(rc)}`);
    //   console.log(`rc.logs: ${util.inspect(rc.logs)}`);
    //   console.log(`rc.events: ${util.inspect(rc.events)}`);
    //
    //   await expect(rc).to.be.equals([true, sender.address]);
    //   // .to.emit(this.minimalForwarder, "Forwarded")
    //   // .withArgs(true, ethers.constants.AddressZero);
    //   // .to.emit(this.context, "Sender")
    //   // .withArgs(sender.address);
    // });
  });

  // describe("msgData", function () {
  //   const integerValue = BigNumber.from("34130");
  //   const stringValue = "OpenZeppelin";
  //
  //   let callData: string;
  //
  //   beforeEach(async function () {
  //     callData = functionCallEncodeABI(
  //       "msgData",
  //       "uint256 integerValue, string memory stringValue",
  //       [integerValue.toString(), stringValue]
  //     );
  //   });
  //
  //   it("returns the transaction data when called from an EOA", async function () {
  //     await expect(await this.context.msgData(integerValue, stringValue))
  //       .to.emit(this.context, "Data")
  //       .withArgs(callData, integerValue, stringValue);
  //   });
  //
  //   it("returns the transaction sender when from another contract", async function () {
  //     await expect(
  //       await this.minimalForwarder.callData(
  //         this.context.address,
  //         integerValue,
  //         stringValue
  //       )
  //     )
  //       .to.emit(this.context, "Data")
  //       .withArgs(callData, integerValue, stringValue);
  //   });
  // });
}
