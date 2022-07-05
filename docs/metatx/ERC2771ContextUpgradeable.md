# ERC2771ContextUpgradeable





Implementing an updatable Trusted Forwarder



## Methods

### isTrustedForwarder

```solidity
function isTrustedForwarder(address forwarder) external view returns (bool)
```

Checks if it&#39;s the current trusted forwarder.

*ERC 2771 implementation*

#### Parameters

| Name | Type | Description |
|---|---|---|
| forwarder | address | canditate forwarder address |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | true if it is the trusted forwarder |



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

Emitted when the trusted forwarder have been successfully changed



#### Parameters

| Name | Type | Description |
|---|---|---|
| oldTF  | address | previous trusted forwader |
| newTF  | address | new registred trusted forwader |



