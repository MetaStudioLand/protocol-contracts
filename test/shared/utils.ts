import {BigNumber} from "ethers";
import {Suite} from "mocha";
import {NB_DECIMALS} from "./constants";
import {Signers} from "./types";

/**
 * Convert integer value into Tokens BigNumber (18 décimals)
 * ex 5_000_000_000 => 5_000_000_000_000_000_000_000_000_000_000_000_000
 * @param {number} amount
 * @returns {BigNumber}
 */
export const tokens = function (amount: number): BigNumber {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(NB_DECIMALS));
};

/**
 * Look for Signers into the main Suite Context
 * @param {Mocha.Suite} suite
 * @returns {Signers}
 */
export const getSuiteSigners = (suite: Suite): Signers => {
  let currSuite: Suite | null = suite;
  const emptySigners = {} as Signers;
  while (currSuite && currSuite.ctx && !currSuite.ctx.signers) {
    currSuite = currSuite.parent ?? null;
  }
  return currSuite?.ctx?.signers ?? emptySigners;
};
