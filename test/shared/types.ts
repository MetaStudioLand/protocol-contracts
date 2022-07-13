import {BigNumber, Contract} from "ethers";
import {Address} from "hardhat-deploy/types";

export interface Signers {
  owner: Address;
  initialHolder: Address;
  recipient: Address;
  spender: Address;
  anotherAccount: Address;
  forwarder: Address;
}

declare module "mocha" {
  export interface Context {
    chainId: number;
    name: string;
    symbol: string;
    initialSupply: BigNumber;
    token: Contract;
    forwarder: Contract;
    signers: Signers;
  }
}
