import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BigNumber, Contract} from "ethers";
import {tracer} from "hardhat";
import {toBN} from "./helpers";
import {ISuiteOptions} from "./suite";

export abstract class AbstractContrat<T> {
  protected readonly options: ISuiteOptions;
  protected readonly owner: SignerWithAddress;
  protected readonly initialHolder: SignerWithAddress;
  protected readonly recipient: SignerWithAddress;
  protected readonly anotherAccount: SignerWithAddress;
  protected readonly charles: SignerWithAddress;

  // @ts-ignore
  protected token: Contract;

  public constructor(pOptions: ISuiteOptions) {
    this.options = pOptions;

    /* Affecting accounts */
    this.owner = this.options.accounts[0];
    tracer.nameTags[this.owner.address] = "owner";
    this.initialHolder =
      this.options.accounts[
        this.options.tokensOwnerAccountIdx
          ? this.options.tokensOwnerAccountIdx
          : 0
      ];
    tracer.nameTags[this.initialHolder.address] = "initialHolder";

    const firstUserAccountIdx =
      this.options.firstUserAccountIdx ??
      (this.options.tokensOwnerAccountIdx ?? 0) + 1;

    this.recipient = this.options.accounts[firstUserAccountIdx];
    tracer.nameTags[this.recipient.address] = "recipient";
    this.anotherAccount = this.options.accounts[firstUserAccountIdx + 1];
    tracer.nameTags[this.anotherAccount.address] = "anotherAccount";
    this.charles = this.options.accounts[firstUserAccountIdx + 2];
    tracer.nameTags[this.charles.address] = "charles";
  }

  protected async createToken(): Promise<Contract> {
    // @ts-ignore
    global.token = await this.options.create(this.options);
    // @ts-ignore
    return global.token; // this.options.create(this.options);
  }

  tokens(amount: number): BigNumber {
    return toBN(amount).mul(toBN(10).pow(this.options.decimals));
  }

  // @ts-ignore
  abstract async run(runOptions: T): Promise<void>;
}
