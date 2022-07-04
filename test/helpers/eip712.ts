import * as ethSigUtil from "eth-sig-util";

type Message = {
  owner: string;
  spender: string;
  value: string;
  nonce: string;
  deadline: string;
};

type Contract = {
  address: string;
};

const EIP712Domain = [
  {name: "name", type: "string"},
  {name: "version", type: "string"},
  {name: "chainId", type: "uint256"},
  {name: "verifyingContract", type: "address"},
];

type Data712 = {
  types: {
    EIP712Domain: [
      {
        name: "name";
        type: "string";
      },
      {
        name: "version";
        type: "string";
      },
      {
        name: "chainId";
        type: "uint256";
      },
      {
        name: "verifyingContract";
        type: "address";
      }
    ];
    Permit: [
      {
        name: "owner";
        type: "address";
      },
      {
        name: "spender";
        type: "address";
      },
      {
        name: "value";
        type: "uint256";
      },
      {
        name: "nonce";
        type: "uint256";
      },
      {
        name: "deadline";
        type: "uint256";
      }
    ];
  };
  primaryType: "Permit";
  domain: {
    name: string;
    version: "1";
    chainId: number;
    verifyingContract: string;
  };
  message: Message;
};

export const data712 = function (
  name: string,
  chainId: number,
  verifyingContract: Contract,
  message: Message
): Data712 {
  return {
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      Permit: [
        {
          name: "owner",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
        {
          name: "value",
          type: "uint256",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "deadline",
          type: "uint256",
        },
      ],
    },
    primaryType: "Permit",
    domain: {
      name: name,
      version: "1",
      chainId: chainId,
      verifyingContract: verifyingContract.address,
    },
    message: message,
  };
};

export async function domainSeparator(
  name: string,
  version: string,
  chainId: number,
  verifyingContract: Contract
) {
  return (
    "0x" +
    ethSigUtil.TypedDataUtils.hashStruct(
      "EIP712Domain",
      {name, version, chainId, verifyingContract: verifyingContract.address},
      {EIP712Domain}
    ).toString("hex")
  );
}
