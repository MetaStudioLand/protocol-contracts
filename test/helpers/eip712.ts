import * as ethSigUtil from "eth-sig-util";

export const EIP712Domain = [
  {name: "name", type: "string"},
  {name: "version", type: "string"},
  {name: "chainId", type: "uint256"},
  {name: "verifyingContract", type: "address"},
];

export const Permit = [
  {name: "owner", type: "address"},
  {name: "spender", type: "address"},
  {name: "value", type: "uint256"},
  {name: "nonce", type: "uint256"},
  {name: "deadline", type: "uint256"},
];

export const domainSeparator = async (
  name: any,
  version: any,
  chainId: any,
  verifyingContract: any
): Promise<string> => {
  return (
    "0x" +
    ethSigUtil.TypedDataUtils.hashStruct(
      "EIP712Domain",
      {name, version, chainId, verifyingContract},
      {EIP712Domain}
    ).toString("hex")
  );
};
