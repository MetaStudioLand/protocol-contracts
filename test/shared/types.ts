import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Contract} from "ethers";

export interface Signers {
  owner: SignerWithAddress;
  initialHolder: SignerWithAddress;
  recipient: SignerWithAddress;
  spender: SignerWithAddress;
  anotherAccount: SignerWithAddress;
}

declare module "mocha" {
  export interface Context {
    token: Contract;
    signers: Signers;
  }
}
