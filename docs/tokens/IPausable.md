# IPausable



> Interface &quot;Pausable&quot;



*declaration of Ipausable methodes*

## Methods

### pause

```solidity
function pause() external nonpayable
```

Set the contract in pause. No transfert is allowed




### paused

```solidity
function paused() external view returns (bool)
```

check if a contract is in `Pause` state




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | Return true if the contract is in `Pause` otherwise false |

### unpause

```solidity
function unpause() external nonpayable
```

Set the contract in ready state. Transferts are allowed







