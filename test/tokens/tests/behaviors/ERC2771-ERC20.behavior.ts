import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BigNumber, Contract} from "ethers";
import {Signers} from "../../../shared/types";
import {functionCallEncodeABI, getAddress} from "../../../shared/utils";
import {
  shouldBehaveLikeERC20Approve,
  shouldBehaveLikeERC20Transfer,
  shouldBehaveLikeERC20TransferFrom,
} from "./ERC20.behavior";

export function shouldBehaveLikeForwardedRegularERC20(
  signers: Signers,
  initialSupply: BigNumber
) {
  describe("transfer", function () {
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
          getAddress(to),
          amount,
        ]);
        const fromAddress = getAddress(from);
        // @ts-ignore
        const nonce = await forwarder.getNonce(fromAddress);
        const req = {
          from: fromAddress,
          to: token.address,
          value: 0,
          gas: "10000000",
          nonce: nonce.toString(),
          data,
        };
        // @ts-ignore
        return forwarder.connect(from).execute(req);
      }
    );
  });

  describe("transfer from", function () {
    shouldBehaveLikeERC20TransferFrom(
      signers.recipient,
      signers.initialHolder,
      signers.anotherAccount,
      initialSupply,
      async function (
        token: Contract,
        spender: SignerWithAddress | string,
        tokenOwner: SignerWithAddress | string,
        to: SignerWithAddress | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        const data = functionCallEncodeABI(
          "transferFrom",
          "address,address,uint256",
          [getAddress(tokenOwner), getAddress(to), amount]
        );
        // @ts-ignore
        const nonce = await forwarder.getNonce(getAddress(spender));
        const req = {
          from: getAddress(spender),
          to: token.address,
          value: 0,
          gas: "10000000",
          nonce: nonce.toString(),
          data,
        };
        // @ts-ignore
        return forwarder.connect(spender).execute(req);
      }
    );
  });

  describe("approve", function () {
    shouldBehaveLikeERC20Approve(
      signers.initialHolder,
      signers.recipient,
      initialSupply,
      async function (
        token: Contract,
        owner: SignerWithAddress | string,
        spender: SignerWithAddress | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        const data = functionCallEncodeABI("approve", "address,uint256", [
          getAddress(spender),
          amount,
        ]);
        const fromAddress = getAddress(owner);
        // @ts-ignore
        const nonce = await forwarder.getNonce(fromAddress);
        const req = {
          from: fromAddress,
          to: token.address,
          value: 0,
          gas: "10000000",
          nonce: nonce.toString(),
          data,
        };
        // @ts-ignore
        return forwarder.connect(owner).execute(req);
      }
    );
  });
}
