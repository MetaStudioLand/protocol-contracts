// import {BigNumber} from "ethers";
// import {ethers} from "hardhat";

// /**
//  * Converts given value to BN object if it is number or string.
//  * Otherwise defaultValue is returned in case given value is not truthy.
//  *
//  * @param {number|string|BN|null} number
//  * @param {number|string|BN|null} [defaultValue]
//  * @returns {BigNumber|null}
//  */
// export function toBN(
//   number: number | string | BigNumber | null,
//   defaultValue: number | string | BigNumber | null = null
// ): BigNumber {
//   if (number == null) {
//     if (defaultValue == null) {
//       throw new Error("Can not convert null to BigNumber");
//     }
//     number = defaultValue;
//   }
//   return ethers.BigNumber.from(number);
// }

// export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
// export const ZERO_BYTES32 =
//   "0x0000000000000000000000000000000000000000000000000000000000000000";
// export const MAX_UINT256 = toBN("2").pow(toBN("256")).sub(toBN("1"));
// export const MAX_INT256 = toBN("2").pow(toBN("255")).sub(toBN("1"));
// export const MIN_INT256 = toBN("2").pow(toBN("255")).mul(toBN("-1"));
