// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC777Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1820ImplementerUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol";
import "../metatx/ERC2771ContextUpgradeable.sol";
import "../metatx/IERC2771Upgradeable.sol";

/// @custom:security-contact it@theblockchainxdev.com:
contract MetaStudioToken is
  IERC165Upgradeable,
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC20PermitUpgradeable,
  ERC20VotesUpgradeable,
  ERC777Upgradeable,
  IERC1820ImplementerUpgradeable,
  ERC2771ContextUpgradeable,
  UUPSUpgradeable
{
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(
    address tokensOwner,
    address forwarder,
    address[] memory defaultOperators_
  ) external initializer {
    require(tokensOwner != address(0), "tokensOwner is mandatory");
    // @defaultOperators_ : the list of default operators. These accounts are operators for all token holders, even if authorizeOperator was never called on them
    __ERC777_init("MetaStudioToken", "SMV", defaultOperators_);
    __Ownable_init();
    __ReentrancyGuard_init();
    __ERC2771_init(forwarder);
    __Pausable_init();
    __ERC20Permit_init("MetaStudioToken");
    __ERC20Votes_init();
    __UUPSUpgradeable_init();

    _mint(tokensOwner, 5_000_000_000 * 10**decimals());
  }

  function supportsInterface(bytes4 interfaceId)
    external
    pure
    override
    returns (bool)
  {
    return
      interfaceId == type(IERC165Upgradeable).interfaceId ||
      interfaceId == type(IERC20Upgradeable).interfaceId ||
      interfaceId == type(IERC777Upgradeable).interfaceId ||
      interfaceId == type(IERC2771Upgradeable).interfaceId;
  }

  /*
   * Inheritance extensions
   */

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }

  // #dev https://soliditydeveloper.com/erc-777
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override whenNotPaused nonReentrant {
    super._beforeTokenTransfer(from, to, amount);
  }

  // #dev https://soliditydeveloper.com/erc-777
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256 amount
  ) internal override whenNotPaused nonReentrant {
    super._beforeTokenTransfer(operator, from, to, amount);
  }

  function _authorizeUpgrade(address newImplementation)
    internal
    override
    onlyOwner
  // solhint-disable-next-line no-empty-blocks
  {

  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(address to, uint256 amount)
    internal
    override(ERC20Upgradeable, ERC20VotesUpgradeable)
  {
    super._mint(to, amount);
  }

  function _burn(address account, uint256 amount)
    internal
    override(ERC20Upgradeable, ERC20VotesUpgradeable)
  {
    super._burn(account, amount);
  }

  function canImplementInterfaceForAddress(
    bytes32 interfaceHash,
    address account
  ) external view returns (bytes32) {
    return keccak256("ERC1820_ACCEPT_MAGIC");
  }

  /*
   ERC777 overrided methodes-----
   */

  function approve(address spender, uint256 value)
    public
    override(ERC20Upgradeable, ERC777Upgradeable)
    returns (bool)
  {
    return super.approve(spender, value);
  }

  function _approve(
    address holder,
    address spender,
    uint256 value
  ) internal override(ERC20Upgradeable, ERC777Upgradeable) {
    super._approve(holder, spender, value);
  }

  function _spendAllowance(
    address _owner,
    address spender,
    uint256 amount
  ) internal override(ERC20Upgradeable, ERC777Upgradeable) {
    super._spendAllowance(_owner, spender, amount);
  }

  function allowance(address holder, address spender)
    public
    view
    override(ERC20Upgradeable, ERC777Upgradeable)
    returns (uint256)
  {
    return super.allowance(holder, spender);
  }

  function balanceOf(address tokenHolder)
    public
    view
    override(ERC20Upgradeable, ERC777Upgradeable)
    returns (uint256)
  {
    return super.balanceOf(tokenHolder);
  }

  function decimals()
    public
    pure
    override(ERC20Upgradeable, ERC777Upgradeable)
    returns (uint8)
  {
    return 18;
  }

  function name()
    public
    view
    override(ERC20Upgradeable, ERC777Upgradeable)
    returns (string memory)
  {
    return super.name();
  }

  function symbol()
    public
    view
    override(ERC20Upgradeable, ERC777Upgradeable)
    returns (string memory)
  {
    return super.symbol();
  }

  function totalSupply()
    public
    view
    override(ERC20Upgradeable, ERC777Upgradeable)
    returns (uint256)
  {
    return super.totalSupply();
  }

  function transfer(address recipient, uint256 amount)
    public
    override(ERC20Upgradeable, ERC777Upgradeable)
    returns (bool)
  {
    return super.transfer(recipient, amount);
  }

  function transferFrom(
    address holder,
    address recipient,
    uint256 amount
  ) public override(ERC20Upgradeable, ERC777Upgradeable) returns (bool) {
    return super.transferFrom(holder, recipient, amount);
  }

  /*
    Extended ERC2771
  */

  /// @dev should be declared here because we need to protect calls with onlyOwner
  function setTrustedForwarder(address forwarder) external onlyOwner {
    super._setTrustedForwarder(forwarder);
  }

  function _msgSender()
    internal
    view
    virtual
    override(ContextUpgradeable, ERC2771ContextUpgradeable)
    returns (address sender)
  {
    return super._msgSender();
  }

  function _msgData()
    internal
    view
    virtual
    override(ContextUpgradeable, ERC2771ContextUpgradeable)
    returns (bytes calldata)
  {
    return super._msgData();
  }
}
