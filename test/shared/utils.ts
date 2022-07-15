import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import {expect} from 'chai';
import {BigNumber, ContractReceipt, ContractTransaction} from 'ethers';
import {ethers, network} from 'hardhat';
import {Context, Suite} from 'mocha';
import {promisify} from 'util';
import {NB_DECIMALS} from './constants';

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

export const functionCallEncodeABI = (functionName: string, functionParams: string, paramsValues?: any[]) => {
  const ABI = [`function ${functionName}(${functionParams})`];
  // console.log(`ABI: ${ABI}`);
  const iface = new ethers.utils.Interface(ABI);
  return iface.encodeFunctionData(functionName, paramsValues);
};

export const logNameTags = () => {
  console.log(`Names:`);
};

export const getAddress = (accountOrAddress: SignerWithAddress | string): string => {
  return typeof accountOrAddress === 'string' ? accountOrAddress : accountOrAddress.address;
};

export function waitFor(p: Promise<ContractTransaction>): Promise<ContractReceipt> {
  return p.then((tx) => tx.wait());
}
export const queue = promisify(setImmediate);
export async function countPendingTransactions() {
  return parseInt(await network.provider.send('eth_getBlockTransactionCountByNumber', ['pending']));
}

export async function batchInBlock(txs: any[]) {
  try {
    // disable auto-mining
    await network.provider.send('evm_setAutomine', [false]);
    // send all transactions
    const promises = txs.map((fn: () => any) => fn());
    // wait for node to have all pending transactions
    while (txs.length > (await countPendingTransactions())) {
      await queue();
    }
    // mine one block
    await network.provider.send('evm_mine');
    // fetch receipts
    const receipts = await Promise.all(promises);
    // Sanity check, all tx should be in the same block
    const minedBlocks = new Set(receipts.map(({receipt}) => receipt));
    expect(minedBlocks.size).to.equal(1);

    return receipts;
  } finally {
    // enable auto-mining
    await network.provider.send('evm_setAutomine', [true]);
  }
}
