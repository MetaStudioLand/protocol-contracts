import {expect} from "chai";
import {BigNumber} from "ethers";
import {network} from "hardhat";
import {promisify} from "util";
import {keccak256, toUtf8Bytes} from "ethers/lib/utils";

export const NB_DECIMALS = 18;
export const DATA = "0x42000000";
export const RECEIVER_MAGIC_VALUE = "0x88a7ca5c";
export const SPENDER_MAGIC_VALUE = "0x7b04a2d0";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const EIP712Domain = [
  {name: "name", type: "string"},
  {name: "version", type: "string"},
  {name: "chainId", type: "uint256"},
  {name: "verifyingContract", type: "address"},
];
export const Delegation = [
  {name: "delegatee", type: "address"},
  {name: "nonce", type: "uint256"},
  {name: "expiry", type: "uint256"},
];
export const MAX_UINT256 = BigNumber.from(2)
  .pow(BigNumber.from(256))
  .sub(BigNumber.from(1));
export const queue = promisify(setImmediate);
export async function countPendingTransactions() {
  return parseInt(
    await network.provider.send("eth_getBlockTransactionCountByNumber", [
      "pending",
    ])
  );
}

export async function batchInBlock(txs: any[]) {
  try {
    // disable auto-mining
    await network.provider.send("evm_setAutomine", [false]);
    // send all transactions
    const promises = txs.map((fn: () => any) => fn());
    // wait for node to have all pending transactions
    while (txs.length > (await countPendingTransactions())) {
      await queue();
    }
    // mine one block
    await network.provider.send("evm_mine");
    // fetch receipts
    const receipts = await Promise.all(promises);
    // Sanity check, all tx should be in the same block
    const minedBlocks = new Set(receipts.map(({receipt}) => receipt));
    expect(minedBlocks.size).to.equal(1);

    return receipts;
  } finally {
    // enable auto-mining
    await network.provider.send("evm_setAutomine", [true]);
  }
}

export const ROLES_ADMIN_ROLE = keccak256(toUtf8Bytes("ROLES_ADMIN_ROLE"));
export const PROXY_ROLE = keccak256(toUtf8Bytes("PROXY_ROLE"));
export const FORWARDER_ROLE = keccak256(toUtf8Bytes("FORWARDER_ROLE"));
export const PAUSER_ROLE = keccak256(toUtf8Bytes("PAUSER_ROLE"));
