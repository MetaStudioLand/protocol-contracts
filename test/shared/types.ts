import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BigNumber, Contract} from "ethers";

export interface Signers {
  owner: SignerWithAddress;
  initialHolder: SignerWithAddress;
  recipient: SignerWithAddress;
  spender: SignerWithAddress;
  anotherAccount: SignerWithAddress;
  forwarder: SignerWithAddress;
}

declare module "mocha" {
  export interface Context {
    token: Contract;
    forwarder: Contract;
    signers: Signers;
    initialSupply: BigNumber;
  }
}
