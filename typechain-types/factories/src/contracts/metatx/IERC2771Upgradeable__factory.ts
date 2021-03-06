/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IERC2771Upgradeable,
  IERC2771UpgradeableInterface,
} from "../../../../src/contracts/metatx/IERC2771Upgradeable";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IERC2771Upgradeable__factory {
  static readonly abi = _abi;
  static createInterface(): IERC2771UpgradeableInterface {
    return new utils.Interface(_abi) as IERC2771UpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IERC2771Upgradeable {
    return new Contract(address, _abi, signerOrProvider) as IERC2771Upgradeable;
  }
}
