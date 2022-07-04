
type Message = {
  owner: string;
  spender: string;
  value: string;
  nonce: string;
  deadline: string;
};
type MessageDelegation ={
  delegatee: any ,
  nonce :any,
  expiry: any,
}
type Contract = {
  address: string;
};


type DataNew = {
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
    Delegation : [
      { name: 'delegatee', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
    ];
  };
  primaryType: "Delegation";
  domain: {
    name: string;
    version: "1";
    chainId: number;
    verifyingContract: string;
  };
  message: MessageDelegation;
};





export const datanew = function (
  name: string,
  chainId: number,
  verifyingContract: Contract,
  message: MessageDelegation
): DataNew {
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
      Delegation: [
        { name: 'delegatee', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiry', type: 'uint256' },
      ],
    },
    primaryType: "Delegation",
    domain: {
      name: name,
      version: "1",
      chainId: chainId,
      verifyingContract: verifyingContract.address,
    },
    message: message,
  };
};






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
