import {keccak256, toUtf8Bytes} from 'ethers/lib/utils';

export const NB_DECIMALS = 18;
export const DATA = '0x42000000';
export const RECEIVER_MAGIC_VALUE = '0x88a7ca5c';
export const SPENDER_MAGIC_VALUE = '0x7b04a2d0';
export const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const PROXY_ROLE = keccak256(toUtf8Bytes('PROXY_ROLE'));
export const FORWARDER_ROLE = keccak256(toUtf8Bytes('FORWARDER_ROLE'));
export const PAUSER_ROLE = keccak256(toUtf8Bytes('PAUSER_ROLE'));

export const DOMAIN_VERSION = '1';
