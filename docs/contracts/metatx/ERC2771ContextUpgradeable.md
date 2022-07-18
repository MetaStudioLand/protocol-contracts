# ERC2771ContextUpgradeable



> Implementation of ERC2771 standard

`Meta Transactions` implementation

*Implementing an updatable `trusted forwarder`*

## Methods

### isTrustedForwarder

```solidity
function isTrustedForwarder(address forwarder) external view returns (bool)
```

Checks if the address is the current trusted forwarder.

*ERC2771 implementation*

#### Parameters

| Name | Type | Description |
|---|---|---|
| forwarder | address | address to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | true if it&#39;s the trusted forwarder |



## Events

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### TrustedForwarderChanged

```solidity
event TrustedForwarderChanged(address oldTF, address newTF)
```

Emitted when the trusted forwarder has been successfully changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| oldTF  | address | previous trusted forwader |
| newTF  | address | new registered trusted forwarder |



