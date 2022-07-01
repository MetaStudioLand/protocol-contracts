// import * as ethSigUtil from "eth-sig-util";
// import {Contract} from "ethers";
// import {Web3Provider} from "ethers/providers";
// import {
//   BigNumber,
//   bigNumberify,
//   defaultAbiCoder,
//   getAddress,
//   keccak256,
//   solidityPack,
//   toUtf8Bytes,
// } from "ethers/utils";
//
// export const EIP712Domain = [
//   {name: "name", type: "string"},
//   {name: "version", type: "string"},
//   {name: "chainId", type: "uint256"},
//   {name: "verifyingContract", type: "address"},
// ];
//
// export const Permit = [
//   {name: "owner", type: "address"},
//   {name: "spender", type: "address"},
//   {name: "value", type: "uint256"},
//   {name: "nonce", type: "uint256"},
//   {name: "deadline", type: "uint256"},
// ];
//
// export const domainSeparator = async (
//   name: any,
//   version: any,
//   chainId: any,
//   verifyingContract: any
// ): Promise<string> => {
//   return (
//     "0x" +
//     ethSigUtil.TypedDataUtils.hashStruct(
//       "EIP712Domain",
//       {name, version, chainId, verifyingContract},
//       {EIP712Domain}
//     ).toString("hex")
//   );
// };
//
// const PERMIT_TYPEHASH = keccak256(
//   toUtf8Bytes(
//     "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
//   )
// );
//
// export function expandTo18Decimals(n: number): BigNumber {
//   return bigNumberify(n).mul(bigNumberify(10).pow(18));
// }
//
// function getDomainSeparator(name: string, tokenAddress: string) {
//   return keccak256(
//     defaultAbiCoder.encode(
//       ["bytes32", "bytes32", "bytes32", "uint256", "address"],
//       [
//         keccak256(
//           toUtf8Bytes(
//             "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
//           )
//         ),
//         keccak256(toUtf8Bytes(name)),
//         keccak256(toUtf8Bytes("1")),
//         1,
//         tokenAddress,
//       ]
//     )
//   );
// }
//
// export function getCreate2Address(
//   factoryAddress: string,
//   [tokenA, tokenB]: [string, string],
//   bytecode: string
// ): string {
//   const [token0, token1] =
//     tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
//   const create2Inputs = [
//     "0xff",
//     factoryAddress,
//     keccak256(solidityPack(["address", "address"], [token0, token1])),
//     keccak256(bytecode),
//   ];
//   const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join("")}`;
//   return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`);
// }
//
// export async function getApprovalDigest(
//   token: Contract,
//   approve: {
//     owner: string;
//     spender: string;
//     value: BigNumber;
//   },
//   nonce: BigNumber,
//   deadline: BigNumber
// ): Promise<string> {
//   const name = await token.name();
//   const DOMAIN_SEPARATOR = getDomainSeparator(name, token.address);
//   return keccak256(
//     solidityPack(
//       ["bytes1", "bytes1", "bytes32", "bytes32"],
//       [
//         "0x19",
//         "0x01",
//         DOMAIN_SEPARATOR,
//         keccak256(
//           defaultAbiCoder.encode(
//             ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
//             [
//               PERMIT_TYPEHASH,
//               approve.owner,
//               approve.spender,
//               approve.value,
//               nonce,
//               deadline,
//             ]
//           )
//         ),
//       ]
//     )
//   );
// }
//
// export async function mineBlock(
//   provider: Web3Provider,
//   timestamp: number
// ): Promise<void> {
//   await new Promise(async (resolve, reject) => {
//     (provider._web3Provider.sendAsync as any)(
//       {jsonrpc: "2.0", method: "evm_mine", params: [timestamp]},
//       (error: any, result: any): void => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// }
//
// export function encodePrice(reserve0: BigNumber, reserve1: BigNumber) {
//   return [
//     reserve1.mul(bigNumberify(2).pow(112)).div(reserve0),
//     reserve0.mul(bigNumberify(2).pow(112)).div(reserve1),
//   ];
// }
