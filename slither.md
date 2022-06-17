Summary
 - [controlled-delegatecall](#controlled-delegatecall) (1 results) (High)
 - [unprotected-upgrade](#unprotected-upgrade) (1 results) (High)
 - [incorrect-equality](#incorrect-equality) (1 results) (Medium)
 - [uninitialized-local](#uninitialized-local) (3 results) (Medium)
 - [unused-return](#unused-return) (1 results) (Medium)
 - [shadowing-local](#shadowing-local) (2 results) (Low)
 - [variable-scope](#variable-scope) (4 results) (Low)
 - [reentrancy-benign](#reentrancy-benign) (3 results) (Low)
 - [reentrancy-events](#reentrancy-events) (5 results) (Low)
 - [timestamp](#timestamp) (2 results) (Low)
 - [assembly](#assembly) (7 results) (Informational)
 - [pragma](#pragma) (1 results) (Informational)
 - [dead-code](#dead-code) (5 results) (Informational)
 - [solc-version](#solc-version) (34 results) (Informational)
 - [low-level-calls](#low-level-calls) (4 results) (Informational)
 - [naming-convention](#naming-convention) (43 results) (Informational)
 - [similar-names](#similar-names) (3 results) (Informational)
 - [unused-state](#unused-state) (2 results) (Informational)
 - [constable-states](#constable-states) (1 results) (Optimization)
## controlled-delegatecall
Impact: High
Confidence: Medium
 - [ ] ID-0
[ERC1967UpgradeUpgradeable._functionDelegateCall(address,bytes)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L198-L204) uses delegatecall to a input-controlled function id
	- [(success,returndata) = target.delegatecall(data)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L202)

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L198-L204


## unprotected-upgrade
Impact: High
Confidence: High
 - [ ] ID-1
[MetaStudioToken](contracts/tokens/MetaStudioToken.sol#L20-L301) is an upgradeable contract that does not protect its initiliaze functions: [MetaStudioToken.initialize(address,address,address[])](contracts/tokens/MetaStudioToken.sol#L43-L60). Anyone can delete the contract with: [UUPSUpgradeable.upgradeTo(address)](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L72-L75)[UUPSUpgradeable.upgradeToAndCall(address,bytes)](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L85-L88)
contracts/tokens/MetaStudioToken.sol#L20-L301


## incorrect-equality
Impact: Medium
Confidence: High
 - [ ] ID-2
[ERC20VotesUpgradeable._writeCheckpoint(ERC20VotesUpgradeable.Checkpoint[],function(uint256,uint256) returns(uint256),uint256)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L232-L246) uses a dangerous strict equality:
	- [pos > 0 && ckpts[pos - 1].fromBlock == block.number](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L241)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L232-L246


## uninitialized-local
Impact: Medium
Confidence: Medium
 - [ ] ID-3
[ERC20VotesUpgradeable._moveVotingPower(address,address,uint256).newWeight_scope_1](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226) is a local variable never initialized

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226


 - [ ] ID-4
[ERC1967UpgradeUpgradeable._upgradeToAndCallUUPS(address,bytes,bool).slot](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98) is a local variable never initialized

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98


 - [ ] ID-5
[ERC20VotesUpgradeable._moveVotingPower(address,address,uint256).oldWeight_scope_0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226) is a local variable never initialized

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226


## unused-return
Impact: Medium
Confidence: Medium
 - [ ] ID-6
[ERC1967UpgradeUpgradeable._upgradeToAndCallUUPS(address,bytes,bool)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L87-L105) ignores return value by [IERC1822ProxiableUpgradeable(newImplementation).proxiableUUID()](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98-L102)

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L87-L105


## shadowing-local
Impact: Low
Confidence: High
 - [ ] ID-7
[MetaStudioToken._spendAllowance(address,address,uint256)._owner](contracts/tokens/MetaStudioToken.sol#L186) shadows:
	- [OwnableUpgradeable._owner](node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L22) (state variable)

contracts/tokens/MetaStudioToken.sol#L186


 - [ ] ID-8
[ERC20PermitUpgradeable.__ERC20Permit_init(string).name](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L47) shadows:
	- [ERC20Upgradeable.name()](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L67-L69) (function)
	- [IERC20MetadataUpgradeable.name()](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol#L17) (function)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L47


## variable-scope
Impact: Low
Confidence: High
 - [ ] ID-9
Variable '[ERC1967UpgradeUpgradeable._upgradeToAndCallUUPS(address,bytes,bool).slot](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98)' in [ERC1967UpgradeUpgradeable._upgradeToAndCallUUPS(address,bytes,bool)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L87-L105) potentially used before declaration: [require(bool,string)(slot == _IMPLEMENTATION_SLOT,ERC1967Upgrade: unsupported proxiableUUID)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L99)

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98


 - [ ] ID-10
Variable '[ERC20VotesUpgradeable._moveVotingPower(address,address,uint256).oldWeight](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L221)' in [ERC20VotesUpgradeable._moveVotingPower(address,address,uint256)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L214-L230) potentially used before declaration: [(oldWeight,newWeight) = _writeCheckpoint(_checkpoints[dst],_add,amount)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L221


 - [ ] ID-11
Variable '[ECDSAUpgradeable.tryRecover(bytes32,bytes).r](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L62)' in [ECDSAUpgradeable.tryRecover(bytes32,bytes)](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L57-L86) potentially used before declaration: [r = mload(uint256)(signature + 0x20)](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L79)

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L62


 - [ ] ID-12
Variable '[ERC20VotesUpgradeable._moveVotingPower(address,address,uint256).newWeight](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L221)' in [ERC20VotesUpgradeable._moveVotingPower(address,address,uint256)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L214-L230) potentially used before declaration: [(oldWeight,newWeight) = _writeCheckpoint(_checkpoints[dst],_add,amount)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L221


## reentrancy-benign
Impact: Low
Confidence: Medium
 - [ ] ID-13
Reentrancy in [ERC777Upgradeable._send(address,address,uint256,bytes,bytes,bool)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L371-L389):
	External calls:
	- [_callTokensToSend(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L384)
		- [IERC777SenderUpgradeable(implementer).tokensToSend(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L481)
	State variables written after the call(s):
	- [_move(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L386)
		- [_balances[from] = fromBalance - amount](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L437)
		- [_balances[to] += amount](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L439)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L371-L389


 - [ ] ID-14
Reentrancy in [ERC777Upgradeable._burn(address,uint256,bytes,bytes)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L398-L422):
	External calls:
	- [_callTokensToSend(operator,from,address(0),amount,data,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L408)
		- [IERC777SenderUpgradeable(implementer).tokensToSend(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L481)
	State variables written after the call(s):
	- [_balances[from] = fromBalance - amount](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L416)
	- [_totalSupply -= amount](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L418)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L398-L422


 - [ ] ID-15
Reentrancy in [MetaStudioToken.initialize(address,address,address[])](contracts/tokens/MetaStudioToken.sol#L43-L60):
	External calls:
	- [__ERC777_init(MetaStudioToken,SMV,defaultOperators_)](contracts/tokens/MetaStudioToken.sol#L50)
		- [_ERC1820_REGISTRY.setInterfaceImplementer(address(this),keccak256(bytes)(ERC777Token),address(this))](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L83)
		- [_ERC1820_REGISTRY.setInterfaceImplementer(address(this),keccak256(bytes)(ERC20Token),address(this))](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L84)
	State variables written after the call(s):
	- [__ERC20Permit_init(MetaStudioToken)](contracts/tokens/MetaStudioToken.sol#L55)
		- [_HASHED_NAME = hashedName](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L57)
	- [__ERC20Permit_init(MetaStudioToken)](contracts/tokens/MetaStudioToken.sol#L55)
		- [_HASHED_VERSION = hashedVersion](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L58)
	- [__Ownable_init()](contracts/tokens/MetaStudioToken.sol#L51)
		- [_owner = newOwner](node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L78)
	- [__Pausable_init()](contracts/tokens/MetaStudioToken.sol#L54)
		- [_paused = false](node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L39)
	- [__ReentrancyGuard_init()](contracts/tokens/MetaStudioToken.sol#L52)
		- [_status = _NOT_ENTERED](node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L45)
	- [__ERC2771_init(forwarder)](contracts/tokens/MetaStudioToken.sol#L53)
		- [_trustedForwarder = forwarder](contracts/metatx/ERC2771ContextUpgradeable.sol#L49)

contracts/tokens/MetaStudioToken.sol#L43-L60


## reentrancy-events
Impact: Low
Confidence: Medium
 - [ ] ID-16
Reentrancy in [MetaStudioToken.initialize(address,address,address[])](contracts/tokens/MetaStudioToken.sol#L43-L60):
	External calls:
	- [__ERC777_init(MetaStudioToken,SMV,defaultOperators_)](contracts/tokens/MetaStudioToken.sol#L50)
		- [_ERC1820_REGISTRY.setInterfaceImplementer(address(this),keccak256(bytes)(ERC777Token),address(this))](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L83)
		- [_ERC1820_REGISTRY.setInterfaceImplementer(address(this),keccak256(bytes)(ERC20Token),address(this))](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L84)
	- [_mint(tokensOwner,5_000_000_000 * 10 ** decimals())](contracts/tokens/MetaStudioToken.sol#L59)
		- [IERC777RecipientUpgradeable(implementer).tokensReceived(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L507)
	Event emitted after the call(s):
	- [Minted(operator,account,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L358)
		- [_mint(tokensOwner,5_000_000_000 * 10 ** decimals())](contracts/tokens/MetaStudioToken.sol#L59)
	- [Transfer(address(0),account,amount)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L359)
		- [_mint(tokensOwner,5_000_000_000 * 10 ** decimals())](contracts/tokens/MetaStudioToken.sol#L59)

contracts/tokens/MetaStudioToken.sol#L43-L60


 - [ ] ID-17
Reentrancy in [ERC777Upgradeable._burn(address,uint256,bytes,bytes)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L398-L422):
	External calls:
	- [_callTokensToSend(operator,from,address(0),amount,data,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L408)
		- [IERC777SenderUpgradeable(implementer).tokensToSend(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L481)
	Event emitted after the call(s):
	- [Burned(operator,from,amount,data,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L420)
	- [Transfer(from,address(0),amount)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L421)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L398-L422


 - [ ] ID-18
Reentrancy in [MetaStudioToken.initialize(address,address,address[])](contracts/tokens/MetaStudioToken.sol#L43-L60):
	External calls:
	- [__ERC777_init(MetaStudioToken,SMV,defaultOperators_)](contracts/tokens/MetaStudioToken.sol#L50)
		- [_ERC1820_REGISTRY.setInterfaceImplementer(address(this),keccak256(bytes)(ERC777Token),address(this))](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L83)
		- [_ERC1820_REGISTRY.setInterfaceImplementer(address(this),keccak256(bytes)(ERC20Token),address(this))](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L84)
	Event emitted after the call(s):
	- [OwnershipTransferred(oldOwner,newOwner)](node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L79)
		- [__Ownable_init()](contracts/tokens/MetaStudioToken.sol#L51)
	- [TrustedForwarderChanged(currentTrustedForwarder,forwarder)](contracts/metatx/ERC2771ContextUpgradeable.sol#L50)
		- [__ERC2771_init(forwarder)](contracts/tokens/MetaStudioToken.sol#L53)

contracts/tokens/MetaStudioToken.sol#L43-L60


 - [ ] ID-19
Reentrancy in [ERC777Upgradeable._send(address,address,uint256,bytes,bytes,bool)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L371-L389):
	External calls:
	- [_callTokensToSend(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L384)
		- [IERC777SenderUpgradeable(implementer).tokensToSend(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L481)
	Event emitted after the call(s):
	- [Sent(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L441)
		- [_move(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L386)
	- [Transfer(from,to,amount)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L442)
		- [_move(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L386)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L371-L389


 - [ ] ID-20
Reentrancy in [ERC777Upgradeable._mint(address,uint256,bytes,bytes,bool)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L339-L360):
	External calls:
	- [_callTokensReceived(operator,address(0),account,amount,userData,operatorData,requireReceptionAck)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L356)
		- [IERC777RecipientUpgradeable(implementer).tokensReceived(operator,from,to,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L507)
	Event emitted after the call(s):
	- [Minted(operator,account,amount,userData,operatorData)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L358)
	- [Transfer(address(0),account,amount)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L359)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L339-L360


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-21
[ERC20PermitUpgradeable.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L56-L75) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(block.timestamp <= deadline,ERC20Permit: expired deadline)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L65)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L56-L75


 - [ ] ID-22
[ERC20VotesUpgradeable.delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L139-L156) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(block.timestamp <= expiry,ERC20Votes: signature expired)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L147)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L139-L156


## assembly
Impact: Informational
Confidence: High
 - [ ] ID-23
[StorageSlotUpgradeable.getUint256Slot(bytes32)](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L79-L83) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L80-L82)

node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L79-L83


 - [ ] ID-24
[StorageSlotUpgradeable.getAddressSlot(bytes32)](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L52-L56) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L53-L55)

node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L52-L56


 - [ ] ID-25
[ECDSAUpgradeable.tryRecover(bytes32,bytes)](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L57-L86) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L67-L71)
	- [INLINE ASM](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L78-L81)

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L57-L86


 - [ ] ID-26
[ERC2771ContextUpgradeable._msgSender()](contracts/metatx/ERC2771ContextUpgradeable.sol#L53-L69) uses assembly
	- [INLINE ASM](contracts/metatx/ERC2771ContextUpgradeable.sol#L63-L65)

contracts/metatx/ERC2771ContextUpgradeable.sol#L53-L69


 - [ ] ID-27
[StorageSlotUpgradeable.getBytes32Slot(bytes32)](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L70-L74) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L71-L73)

node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L70-L74


 - [ ] ID-28
[AddressUpgradeable.verifyCallResult(bool,bytes,string)](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L174-L194) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L186-L189)

node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L174-L194


 - [ ] ID-29
[StorageSlotUpgradeable.getBooleanSlot(bytes32)](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L61-L65) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L62-L64)

node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L61-L65


## pragma
Impact: Informational
Confidence: High
 - [ ] ID-30
Different versions of Solidity are used:
	- Version used: ['0.8.7', '^0.8.0', '^0.8.1', '^0.8.2']
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/governance/utils/IVotesUpgradeable.sol#L3)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC1820ImplementerUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC777Upgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/interfaces/draft-IERC1822Upgradeable.sol#L4)
	- [^0.8.2](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/proxy/beacon/IBeaconUpgradeable.sol#L4)
	- [^0.8.2](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777SenderUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777Upgradeable.sol#L4)
	- [^0.8.1](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820ImplementerUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol#L4)
	- [0.8.7](contracts/metatx/ERC2771ContextUpgradeable.sol#L2)
	- [0.8.7](contracts/metatx/IERC2771Upgradeable.sol#L2)
	- [0.8.7](contracts/tokens/MetaStudioToken.sol#L2)

node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L4


## dead-code
Impact: Informational
Confidence: Medium
 - [ ] ID-31
[MetaStudioToken._afterTokenTransfer(address,address,uint256)](contracts/tokens/MetaStudioToken.sol#L125-L131) is never used and should be removed

contracts/tokens/MetaStudioToken.sol#L125-L131


 - [ ] ID-32
[ERC2771ContextUpgradeable._msgData()](contracts/metatx/ERC2771ContextUpgradeable.sol#L71-L83) is never used and should be removed

contracts/metatx/ERC2771ContextUpgradeable.sol#L71-L83


 - [ ] ID-33
[MetaStudioToken._beforeTokenTransfer(address,address,uint256)](contracts/tokens/MetaStudioToken.sol#L98-L104) is never used and should be removed

contracts/tokens/MetaStudioToken.sol#L98-L104


 - [ ] ID-34
[MetaStudioToken._burn(address,uint256)](contracts/tokens/MetaStudioToken.sol#L142-L147) is never used and should be removed

contracts/tokens/MetaStudioToken.sol#L142-L147


 - [ ] ID-35
[MetaStudioToken._msgData()](contracts/tokens/MetaStudioToken.sol#L292-L300) is never used and should be removed

contracts/tokens/MetaStudioToken.sol#L292-L300


## solc-version
Impact: Informational
Confidence: High
 - [ ] ID-36
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777Upgradeable.sol#L4


 - [ ] ID-37
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L4


 - [ ] ID-38
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/governance/utils/IVotesUpgradeable.sol#L3) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/governance/utils/IVotesUpgradeable.sol#L3


 - [ ] ID-39
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820ImplementerUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820ImplementerUpgradeable.sol#L4


 - [ ] ID-40
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol#L4


 - [ ] ID-41
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L4


 - [ ] ID-42
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC777Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC777Upgradeable.sol#L4


 - [ ] ID-43
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/StorageSlotUpgradeable.sol#L4


 - [ ] ID-44
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol#L4


 - [ ] ID-45
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L4


 - [ ] ID-46
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L4


 - [ ] ID-47
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L4


 - [ ] ID-48
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L4


 - [ ] ID-49
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L4


 - [ ] ID-50
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol#L4


 - [ ] ID-51
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777SenderUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777SenderUpgradeable.sol#L4


 - [ ] ID-52
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol#L4


 - [ ] ID-53
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/proxy/beacon/IBeaconUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/proxy/beacon/IBeaconUpgradeable.sol#L4


 - [ ] ID-54
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L4


 - [ ] ID-55
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol#L4


 - [ ] ID-56
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol#L4


 - [ ] ID-57
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L4


 - [ ] ID-58
Pragma version[^0.8.2](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L4


 - [ ] ID-59
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol#L4


 - [ ] ID-60
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC1820ImplementerUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC1820ImplementerUpgradeable.sol#L4


 - [ ] ID-61
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol#L4


 - [ ] ID-62
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L4


 - [ ] ID-63
Pragma version[^0.8.2](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#L4


 - [ ] ID-64
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L4


 - [ ] ID-65
Pragma version[^0.8.1](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L4


 - [ ] ID-66
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L4


 - [ ] ID-67
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol#L4


 - [ ] ID-68
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol#L4


 - [ ] ID-69
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts-upgradeable/interfaces/draft-IERC1822Upgradeable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts-upgradeable/interfaces/draft-IERC1822Upgradeable.sol#L4


## low-level-calls
Impact: Informational
Confidence: High
 - [ ] ID-70
Low level call in [AddressUpgradeable.functionCallWithValue(address,bytes,uint256,string)](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L128-L139):
	- [(success,returndata) = target.call{value: value}(data)](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L137)

node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L128-L139


 - [ ] ID-71
Low level call in [AddressUpgradeable.sendValue(address,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L60-L65):
	- [(success) = recipient.call{value: amount}()](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L63)

node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L60-L65


 - [ ] ID-72
Low level call in [AddressUpgradeable.functionStaticCall(address,bytes,string)](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L157-L166):
	- [(success,returndata) = target.staticcall(data)](node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L164)

node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#L157-L166


 - [ ] ID-73
Low level call in [ERC1967UpgradeUpgradeable._functionDelegateCall(address,bytes)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L198-L204):
	- [(success,returndata) = target.delegatecall(data)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L202)

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L198-L204


## naming-convention
Impact: Informational
Confidence: High
 - [ ] ID-74
Function [ERC20PermitUpgradeable.__ERC20Permit_init(string)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L47-L49) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L47-L49


 - [ ] ID-75
Function [IERC20PermitUpgradeable.DOMAIN_SEPARATOR()](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol#L59) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol#L59


 - [ ] ID-76
Variable [EIP712Upgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L120) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L120


 - [ ] ID-77
Function [ERC1967UpgradeUpgradeable.__ERC1967Upgrade_init_unchained()](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L24-L25) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L24-L25


 - [ ] ID-78
Variable [EIP712Upgradeable._HASHED_NAME](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L32) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L32


 - [ ] ID-79
Function [EIP712Upgradeable.__EIP712_init(string,string)](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L50-L52) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L50-L52


 - [ ] ID-80
Function [ERC20VotesUpgradeable.__ERC20Votes_init_unchained()](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L32-L33) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L32-L33


 - [ ] ID-81
Function [ERC20PermitUpgradeable.__ERC20Permit_init_unchained(string)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L51) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L51


 - [ ] ID-82
Variable [ContextUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L36) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L36


 - [ ] ID-83
Function [ERC20VotesUpgradeable.__ERC20Votes_init()](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L29-L30) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L29-L30


 - [ ] ID-84
Function [ReentrancyGuardUpgradeable.__ReentrancyGuard_init_unchained()](node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L44-L46) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L44-L46


 - [ ] ID-85
Function [OwnableUpgradeable.__Ownable_init()](node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L29-L31) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L29-L31


 - [ ] ID-86
Variable [OwnableUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L87) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L87


 - [ ] ID-87
Variable [UUPSUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L107) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L107


 - [ ] ID-88
Variable [ERC20VotesUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L261) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L261


 - [ ] ID-89
Variable [PausableUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L102) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L102


 - [ ] ID-90
Function [ERC20Upgradeable.__ERC20_init_unchained(string,string)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L59-L62) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L59-L62


 - [ ] ID-91
Variable [ERC1967UpgradeUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L211) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L211


 - [ ] ID-92
Function [ERC20Upgradeable.__ERC20_init(string,string)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L55-L57) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L55-L57


 - [ ] ID-93
Function [ReentrancyGuardUpgradeable.__ReentrancyGuard_init()](node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L40-L42) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L40-L42


 - [ ] ID-94
Variable [ERC20PermitUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L108) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L108


 - [ ] ID-95
Function [ContextUpgradeable.__Context_init_unchained()](node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L21-L22) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L21-L22


 - [ ] ID-96
Function [EIP712Upgradeable._EIP712VersionHash()](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L111-L113) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L111-L113


 - [ ] ID-97
Function [ERC2771ContextUpgradeable.__ERC2771_init(address)](contracts/metatx/ERC2771ContextUpgradeable.sol#L24-L28) is not in mixedCase

contracts/metatx/ERC2771ContextUpgradeable.sol#L24-L28


 - [ ] ID-98
Function [UUPSUpgradeable.__UUPSUpgradeable_init_unchained()](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L26-L27) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L26-L27


 - [ ] ID-99
Variable [EIP712Upgradeable._HASHED_VERSION](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L33) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L33


 - [ ] ID-100
Variable [ERC20Upgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L394) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L394


 - [ ] ID-101
Variable [ReentrancyGuardUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L74) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#L74


 - [ ] ID-102
Variable [ERC777Upgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L561) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L561


 - [ ] ID-103
Function [EIP712Upgradeable._EIP712NameHash()](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L101-L103) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L101-L103


 - [ ] ID-104
Function [OwnableUpgradeable.__Ownable_init_unchained()](node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L33-L35) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#L33-L35


 - [ ] ID-105
Variable [UUPSUpgradeable.__self](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L29) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L29


 - [ ] ID-106
Function [ERC1967UpgradeUpgradeable.__ERC1967Upgrade_init()](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L21-L22) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L21-L22


 - [ ] ID-107
Variable [ERC2771ContextUpgradeable.__gap](contracts/metatx/ERC2771ContextUpgradeable.sol#L90) is not in mixedCase

contracts/metatx/ERC2771ContextUpgradeable.sol#L90


 - [ ] ID-108
Function [UUPSUpgradeable.__UUPSUpgradeable_init()](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L23-L24) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L23-L24


 - [ ] ID-109
Function [ERC777Upgradeable.__ERC777_init_unchained(string,string,address[])](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L69-L85) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L69-L85


 - [ ] ID-110
Variable [ERC20PermitUpgradeable._PERMIT_TYPEHASH_DEPRECATED_SLOT](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L40) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L40


 - [ ] ID-111
Function [PausableUpgradeable.__Pausable_init()](node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L34-L36) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L34-L36


 - [ ] ID-112
Function [ERC20PermitUpgradeable.DOMAIN_SEPARATOR()](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L88-L90) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L88-L90


 - [ ] ID-113
Function [ERC777Upgradeable.__ERC777_init(string,string,address[])](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L61-L67) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L61-L67


 - [ ] ID-114
Function [ContextUpgradeable.__Context_init()](node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L18-L19) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#L18-L19


 - [ ] ID-115
Function [EIP712Upgradeable.__EIP712_init_unchained(string,string)](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L54-L59) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol#L54-L59


 - [ ] ID-116
Function [PausableUpgradeable.__Pausable_init_unchained()](node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L38-L40) is not in mixedCase

node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol#L38-L40


## similar-names
Impact: Informational
Confidence: Medium
 - [ ] ID-117
Variable [ERC777Upgradeable._defaultOperators](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L49) is too similar to [ERC777Upgradeable.__ERC777_init(string,string,address[]).defaultOperators_](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L64)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L49


 - [ ] ID-118
Variable [ERC777Upgradeable._defaultOperators](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L49) is too similar to [ERC777Upgradeable.__ERC777_init_unchained(string,string,address[]).defaultOperators_](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L72)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L49


 - [ ] ID-119
Variable [ERC777Upgradeable._defaultOperators](node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L49) is too similar to [MetaStudioToken.initialize(address,address,address[]).defaultOperators_](contracts/tokens/MetaStudioToken.sol#L46)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol#L49


## unused-state
Impact: Informational
Confidence: High
 - [ ] ID-120
[UUPSUpgradeable.__gap](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L107) is never used in [MetaStudioToken](contracts/tokens/MetaStudioToken.sol#L20-L301)

node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L107


 - [ ] ID-121
[ERC20PermitUpgradeable._PERMIT_TYPEHASH_DEPRECATED_SLOT](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L40) is never used in [MetaStudioToken](contracts/tokens/MetaStudioToken.sol#L20-L301)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L40


## constable-states
Impact: Optimization
Confidence: High
 - [ ] ID-122
[ERC20PermitUpgradeable._PERMIT_TYPEHASH_DEPRECATED_SLOT](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L40) should be constant

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L40


