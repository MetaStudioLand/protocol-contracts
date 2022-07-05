# IPausable



> Interface &quot;Pausable&quot;





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

Return true if contract is in `Pause` state




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### unpause

```solidity
function unpause() external nonpayable
```

Set the contract in ready state. Transferts are allowed







