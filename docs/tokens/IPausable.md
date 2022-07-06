# IPausable



> Interface &quot;Pausable&quot;



*declaration of IPausable methods*

## Methods

### pause

```solidity
function pause() external nonpayable
```

Set the contract in pause. No transfer is allowed




### paused

```solidity
function paused() external view returns (bool)
```

check if a contract is in `Pause` state




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | true if the contract is in `Pause` otherwise false |

### unpause

```solidity
function unpause() external nonpayable
```

Set the contract in ready state. Transfers are allowed







