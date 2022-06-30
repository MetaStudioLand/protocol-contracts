import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";

export async function shouldBehaveLikeRegularERC20(sender: SignerWithAddress) {
  describe("forwarding ERC20", function () {
    it("returns the transaction sender when called from an EOA", async function () {
      await expect(await this.token.connect(sender).msgSender()).to.be.equals(
        sender.address
      );
    });

    // it("returns the transaction sender when from another contract", async function () {
    //   // logNameTags();
    //   const data = functionCallEncodeABI("msgSender", "");
    //   const req = {
    //     from: sender.address,
    //     to: this.token.address,
    //     value: 0,
    //     gas: "100000",
    //     nonce: (
    //       await this.minimalForwarder.getNonce(sender.address)
    //     ).toString(),
    //     data,
    //   };
    //
    //   const tx = await this.minimalForwarder.execute(req);
    //
    //   await expect(tx)
    //     // .to.be.equals([true, sender.address]);
    //     .to.emit(this.minimalForwarder, "Forwarded")
    //     .withArgs(true);
    //   // .to.emit(this.token, "Sender")
    //   // .withArgs(sender.address);
    // });
  });
}
