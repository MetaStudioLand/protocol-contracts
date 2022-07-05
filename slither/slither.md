Summary
 - [controlled-delegatecall](#controlled-delegatecall) (1 results) (High)
 - [unprotected-upgrade](#unprotected-upgrade) (1 results) (High)
 - [divide-before-multiply](#divide-before-multiply) (8 results) (Medium)
 - [incorrect-equality](#incorrect-equality) (1 results) (Medium)
 - [uninitialized-local](#uninitialized-local) (3 results) (Medium)
 - [unused-return](#unused-return) (3 results) (Medium)
 - [shadowing-local](#shadowing-local) (1 results) (Low)
 - [variable-scope](#variable-scope) (4 results) (Low)
 - [timestamp](#timestamp) (2 results) (Low)
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
[MetaStudioToken](contracts/tokens/MetaStudioToken.sol#L24-L281) is an upgradeable contract that does not protect its initiliaze functions: [MetaStudioToken.initialize(address,address)](contracts/tokens/MetaStudioToken.sol#L54-L77). Anyone can delete the contract with: [UUPSUpgradeable.upgradeTo(address)](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L72-L75)[UUPSUpgradeable.upgradeToAndCall(address,bytes)](node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol#L85-L88)
contracts/tokens/MetaStudioToken.sol#L24-L281


## divide-before-multiply
Impact: Medium
Confidence: Medium
 - [ ] ID-2
[MathUpgradeable.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135) performs a multiplication on the result of a division:
	-[prod0 = prod0 / twos](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L105)
	-[result = prod0 * inverse](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L132)

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135


 - [ ] ID-3
[MathUpgradeable.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135) performs a multiplication on the result of a division:
	-[denominator = denominator / twos](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L102)
	-[inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L124)

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135


 - [ ] ID-4
[MathUpgradeable.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135) performs a multiplication on the result of a division:
	-[denominator = denominator / twos](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L102)
	-[inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L121)

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135


 - [ ] ID-5
[MathUpgradeable.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135) performs a multiplication on the result of a division:
	-[denominator = denominator / twos](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L102)
	-[inverse = (3 * denominator) ^ 2](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L117)

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135


 - [ ] ID-6
[MathUpgradeable.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135) performs a multiplication on the result of a division:
	-[denominator = denominator / twos](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L102)
	-[inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L125)

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135


 - [ ] ID-7
[MathUpgradeable.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135) performs a multiplication on the result of a division:
	-[denominator = denominator / twos](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L102)
	-[inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L123)

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135


 - [ ] ID-8
[MathUpgradeable.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135) performs a multiplication on the result of a division:
	-[denominator = denominator / twos](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L102)
	-[inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L122)

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135


 - [ ] ID-9
[MathUpgradeable.mulDiv(uint256,uint256,uint256)](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135) performs a multiplication on the result of a division:
	-[denominator = denominator / twos](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L102)
	-[inverse *= 2 - denominator * inverse](node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L126)

node_modules/@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol#L55-L135


## incorrect-equality
Impact: Medium
Confidence: High
 - [ ] ID-10
[ERC20VotesUpgradeable._writeCheckpoint(ERC20VotesUpgradeable.Checkpoint[],function(uint256,uint256) returns(uint256),uint256)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L232-L246) uses a dangerous strict equality:
	- [pos > 0 && ckpts[pos - 1].fromBlock == block.number](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L241)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L232-L246


## uninitialized-local
Impact: Medium
Confidence: Medium
 - [ ] ID-11
[ERC20VotesUpgradeable._moveVotingPower(address,address,uint256).newWeight_scope_1](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226) is a local variable never initialized

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226


 - [ ] ID-12
[ERC1967UpgradeUpgradeable._upgradeToAndCallUUPS(address,bytes,bool).slot](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98) is a local variable never initialized

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98


 - [ ] ID-13
[ERC20VotesUpgradeable._moveVotingPower(address,address,uint256).oldWeight_scope_0](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226) is a local variable never initialized

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226


## unused-return
Impact: Medium
Confidence: Medium
 - [ ] ID-14
[AccessControlEnumerableUpgradeable._revokeRole(bytes32,address)](node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol#L66-L69) ignores return value by [_roleMembers[role].remove(account)](node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol#L68)

node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol#L66-L69


 - [ ] ID-15
[AccessControlEnumerableUpgradeable._grantRole(bytes32,address)](node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol#L58-L61) ignores return value by [_roleMembers[role].add(account)](node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol#L60)

node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol#L58-L61


 - [ ] ID-16
[ERC1967UpgradeUpgradeable._upgradeToAndCallUUPS(address,bytes,bool)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L87-L105) ignores return value by [IERC1822ProxiableUpgradeable(newImplementation).proxiableUUID()](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98-L102)

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L87-L105


## shadowing-local
Impact: Low
Confidence: High
 - [ ] ID-17
[ERC20PermitUpgradeable.__ERC20Permit_init(string).name](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L47) shadows:
	- [ERC20Upgradeable.name()](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#L67-L69) (function)
	- [IERC20MetadataUpgradeable.name()](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol#L17) (function)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L47


## variable-scope
Impact: Low
Confidence: High
 - [ ] ID-18
Variable '[ERC1967UpgradeUpgradeable._upgradeToAndCallUUPS(address,bytes,bool).slot](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98)' in [ERC1967UpgradeUpgradeable._upgradeToAndCallUUPS(address,bytes,bool)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L87-L105) potentially used before declaration: [require(bool,string)(slot == _IMPLEMENTATION_SLOT,ERC1967Upgrade: unsupported proxiableUUID)](node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L99)

node_modules/@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol#L98


 - [ ] ID-19
Variable '[ERC20VotesUpgradeable._moveVotingPower(address,address,uint256).oldWeight](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L221)' in [ERC20VotesUpgradeable._moveVotingPower(address,address,uint256)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L214-L230) potentially used before declaration: [(oldWeight,newWeight) = _writeCheckpoint(_checkpoints[dst],_add,amount)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L221


 - [ ] ID-20
Variable '[ECDSAUpgradeable.tryRecover(bytes32,bytes).r](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L62)' in [ECDSAUpgradeable.tryRecover(bytes32,bytes)](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L57-L88) potentially used before declaration: [r = mload(uint256)(signature + 0x20)](node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L81)

node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol#L62


 - [ ] ID-21
Variable '[ERC20VotesUpgradeable._moveVotingPower(address,address,uint256).newWeight](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L221)' in [ERC20VotesUpgradeable._moveVotingPower(address,address,uint256)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L214-L230) potentially used before declaration: [(oldWeight,newWeight) = _writeCheckpoint(_checkpoints[dst],_add,amount)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L226)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L221


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-22
[ERC20PermitUpgradeable.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L56-L75) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(block.timestamp <= deadline,ERC20Permit: expired deadline)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L65)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L56-L75


 - [ ] ID-23
[ERC20VotesUpgradeable.delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L139-L156) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(block.timestamp <= expiry,ERC20Votes: signature expired)](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L147)

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol#L139-L156


## constable-states
Impact: Optimization
Confidence: High
 - [ ] ID-24
[ERC20PermitUpgradeable._PERMIT_TYPEHASH_DEPRECATED_SLOT](node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L40) should be constant

node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol#L40


