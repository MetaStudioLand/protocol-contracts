import {BigNumber} from "ethers";
import {ethers, tracer} from "hardhat";
import {Context, Suite} from "mocha";
import {NB_DECIMALS} from "./constants";

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
 * Look for Context into the main Suite Context (to use in `describe` blocks)
 * @param {Mocha.Suite} suite
 * @returns {Context}
 */
export const getSuiteContext = (suite: Suite): Context => {
  let currSuite: Suite | null = suite;
  const emptyContext = {} as Context;
  while (currSuite && currSuite.ctx && !currSuite.ctx.signers) {
    currSuite = currSuite.parent ?? null;
  }
  return currSuite?.ctx?.signers ? currSuite.ctx : emptyContext;
};

export const functionCallEncodeABI = (
  functionName: string,
  functionParams: string,
  paramsValues?: any[]
) => {
  const ABI = [`function ${functionName}(${functionParams})`];
  console.log(`ABI: ${ABI}`);
  const iface = new ethers.utils.Interface(ABI);
  return iface.encodeFunctionData(functionName, paramsValues);
};

export const logNameTags = () => {
  console.log(`Names: ${JSON.stringify(tracer.nameTags, null, 3)}`);
};
