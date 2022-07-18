import * as ethSigUtil from 'eth-sig-util';
type MessagePermit = {
  owner: string;
  spender: string;
  value: string;
  nonce: string;
  deadline: string;
};
type MessageDelegation = {
  delegatee: string;
  nonce: string;
  expiry: string;
};
type Contract = {
  address: string;
};

const EIP712Domain = [
  {name: 'name', type: 'string'},
  {name: 'version', type: 'string'},
  {name: 'chainId', type: 'uint256'},
  {name: 'verifyingContract', type: 'address'},
];

const _Permit = [
  {name: 'owner', type: 'address'},
  {name: 'spender', type: 'address'},
  {name: 'value', type: 'uint256'},
  {name: 'nonce', type: 'uint256'},
  {name: 'deadline', type: 'uint256'},
];

const _Delegation = [
  {name: 'delegatee', type: 'address'},
  {name: 'nonce', type: 'uint256'},
  {name: 'expiry', type: 'uint256'},
];

export const getData712ForPermit = function (
  name: string,
  chainId: number,
  verifyingContract: Contract,
  message: MessagePermit
) {
  return {
    types: {
      EIP712Domain: EIP712Domain,
      Permit: _Permit,
    },
    primaryType: 'Permit',
    domain: {
      name: name,
      version: '1',
      chainId: chainId,
      verifyingContract: verifyingContract.address,
    },
    message: message,
  };
};

export const getData712ForDelegation = function (
  name: string,
  chainId: number,
  verifyingContract: Contract,
  message: MessageDelegation
) {
  return {
    types: {
      EIP712Domain: EIP712Domain,
      Delegation: _Delegation,
    },
    primaryType: 'Delegation',
    domain: {
      name: name,
      version: '1',
      chainId: chainId,
      verifyingContract: verifyingContract.address,
    },
    message: message,
  };
};

export async function domainSeparator(name: string, version: string, chainId: number, verifyingContract: Contract) {
  return (
    '0x' +
    ethSigUtil.TypedDataUtils.hashStruct(
      'EIP712Domain',
      {name, version, chainId, verifyingContract: verifyingContract.address},
      {EIP712Domain}
    ).toString('hex')
  );
}
