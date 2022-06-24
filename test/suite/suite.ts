import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BigNumber, Contract} from "ethers";
import {ERC20} from "./token/ERC20/ERC20";
import { ERC777 } from "./token/ERC777/ERC777";

export interface ISuiteERC20Options {
  errorPrefix?: string;
  shouldTestIncreaseDecreaseApproval: boolean;
}

export interface ISuiteERC777Options {

}

export interface ISuiteOptions {
  name: string;
  symbol: string;
  decimals: number;
  accounts: SignerWithAddress[];
  initialSupply: number;
  tokensMintedOnCreate?: boolean;
  tokensOwnerAccountIdx?: number;
  firstUserAccountIdx?: number;

  initialBalances?: [string, BigNumber | number][];
  initialAllowances?: [string, BigNumber | number][];

  create: (options: ISuiteOptions) => Promise<Contract>;
  beforeEach?: (contract: Contract, options: ISuiteOptions) => Promise<void>;
  afterEach?: (contract: Contract, options: ISuiteOptions) => Promise<void>;

  creditIsMinting: boolean;

  mint?: (contract: Contract, to: string, amount: BigNumber) => Promise<void>;
  transfer?: (
    contract: Contract,
    to: string,
    amount: BigNumber
  ) => Promise<void>;

  ercs: {
    [x: string]: any;
    // erc20?: ISuiteERC20Options;
    erc777?: ISuiteERC777Options;
  };
}

export async function runTestSuite(options: ISuiteOptions) {
  // if (options.ercs.erc20) {
  //   await new ERC20().run(options);
  // }
  if (options.ercs.erc777) {
    await new ERC777().run(options);
  }
}
