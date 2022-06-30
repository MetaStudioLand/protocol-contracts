import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BigNumber, Contract} from "ethers";
import {Signers} from "../../shared/types";
import {functionCallEncodeABI} from "../../shared/utils";
import {shouldBehaveLikeERC20Transfer} from "./ERC20.behavior";

export function shouldBehaveLikeForwardedRegularERC20(
  signers: Signers,
  initialSupply: BigNumber
) {
  describe("Transfer", function () {
    shouldBehaveLikeERC20Transfer(
      signers.initialHolder,
      signers.recipient,
      initialSupply,
      async function (
        token: Contract,
        from: SignerWithAddress | string,
        to: SignerWithAddress | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        const data = functionCallEncodeABI("transfer", "address,uint256", [
          typeof to === "string" ? to : to.address,
          amount,
        ]);
        const fromAddress = typeof from === "string" ? from : from.address;
        // @ts-ignore
        const nonce = await forwarder.getNonce(fromAddress);
        const req = {
          from: fromAddress,
          to: token.address,
          value: 0,
          gas: "100000",
          nonce: nonce.toString(),
          data,
        };
        // @ts-ignore
        return forwarder.connect(from).execute(req);
      }
    );
  });
  // it("returns the transaction sender when called from an EOA", async function () {
  //   await expect(await this.token.connect(sender).msgSender()).to.be.equals(
  //     sender.address
  //   );
  // });

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
}
