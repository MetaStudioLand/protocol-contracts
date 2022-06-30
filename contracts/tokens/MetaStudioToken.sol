// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";
import "../metatx/ERC2771ContextUpgradeable.sol";
import "../metatx/IERC2771Upgradeable.sol";
import "../ERC1363/ERC1363ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/// @title The Metastudio's ERC20 token
/// @custom:security-contact it@theblockchainxdev.com:
contract MetaStudioToken is
  Initializable,
  ContextUpgradeable,
  IERC165Upgradeable,
  ERC20Upgradeable,
  ERC1363Upgradeable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  PausableUpgradeable,
  ERC20PermitUpgradeable,
  ERC20VotesUpgradeable,
  ERC2771ContextUpgradeable,
  UUPSUpgradeable
{
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Contract initialisation. 5_000_000_000 tokens are minted
  /// @dev Constructor replacement methods used for Proxified Contract
  /// @param tokensOwner initianally minted Token's owner address
  /// @param forwarder Initial ERC2771 trusted forwarder
  function initialize(address tokensOwner, address forwarder)
    external
    initializer
  {
    require(tokensOwner != address(0), "tokensOwner is mandatory");
    // @defaultOperators_ : the list of default operators. These accounts are operators for all token holders, even if authorizeOperator was never called on them
    __ERC20_init("MetaStudioToken", "SMV");
    __Ownable_init();
    __ReentrancyGuard_init();
    __ERC2771_init(forwarder);
    __Pausable_init();
    __ERC20Permit_init("MetaStudioToken");
    __ERC20Votes_init();
    __ERC1363_init();
    __UUPSUpgradeable_init();

    _mint(tokensOwner, 5_000_000_000 * 10**decimals());
  }

  /// @notice Supported interface ask machine. Implemented interface are `IERC165`, `IERC20`, `IERC2771`, `IERC20Permit`, `IERC1363`
  /// @dev ERC 165 implementation
  /// @param interfaceId interface's id
  /// @return Returns true if the specified interface is implemented by the contract
  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(IERC165Upgradeable, ERC1363Upgradeable)
    returns (bool)
  {
    return
      interfaceId == type(IERC165Upgradeable).interfaceId ||
      interfaceId == type(IERC20Upgradeable).interfaceId ||
      interfaceId == type(IERC20Upgradeable).interfaceId ||
      interfaceId == type(IERC2771Upgradeable).interfaceId ||
      interfaceId == type(IERC20PermitUpgradeable).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  /*
   * Inheritance extensions
   */

  /// @notice Pause the contract aka `Emergency Stop Mechanism`. No action available on it except `unpause`
  /// @dev Only owner can pause
  function pause() external onlyOwner {
    _pause();
  }

  /// @notice Unpause the contract.
  /// @dev Only owner can pause
  function unpause() external onlyOwner {
    _unpause();
  }

  /// @inheritdoc ERC20Upgradeable
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override whenNotPaused nonReentrant {
    super._beforeTokenTransfer(from, to, amount);
  }

  function _authorizeUpgrade(address newImplementation)
    internal
    override
    onlyOwner
  // solhint-disable-next-line no-empty-blocks
  {

  }

  /// @inheritdoc ERC20Upgradeable
  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
    super._afterTokenTransfer(from, to, amount);
  }

  /// @inheritdoc ERC20Upgradeable
  function _mint(address to, uint256 amount)
    internal
    override(ERC20Upgradeable, ERC20VotesUpgradeable)
  {
    super._mint(to, amount);
  }

  /// @inheritdoc ERC20Upgradeable
  function _burn(address account, uint256 amount)
    internal
    override(ERC20Upgradeable, ERC20VotesUpgradeable)
  {
    super._burn(account, amount);
  }

  /// @inheritdoc ERC20Upgradeable
  function approve(address spender, uint256 amount)
    public
    virtual
    override(ERC20Upgradeable)
    returns (bool)
  {
    return super.approve(spender, amount);
  }

  /// @inheritdoc ERC20Upgradeable
  function allowance(address holder, address spender)
    public
    view
    override(ERC20Upgradeable)
    returns (uint256)
  {
    return super.allowance(holder, spender);
  }

  /// @inheritdoc ERC20Upgradeable
  function balanceOf(address tokenHolder)
    public
    view
    override(ERC20Upgradeable)
    returns (uint256)
  {
    return super.balanceOf(tokenHolder);
  }

  /// @inheritdoc ERC20Upgradeable
  function decimals() public pure override(ERC20Upgradeable) returns (uint8) {
    return 18;
  }

  /// @inheritdoc ERC20Upgradeable
  function name()
    public
    view
    override(ERC20Upgradeable)
    returns (string memory)
  {
    return super.name();
  }

  /// @inheritdoc ERC20Upgradeable
  function symbol()
    public
    view
    override(ERC20Upgradeable)
    returns (string memory)
  {
    return super.symbol();
  }

  /// @inheritdoc ERC20Upgradeable
  function totalSupply()
    public
    view
    override(ERC20Upgradeable)
    returns (uint256)
  {
    return super.totalSupply();
  }

  /// @inheritdoc ERC20Upgradeable
  function transfer(address recipient, uint256 amount)
    public
    override(ERC20Upgradeable)
    returns (bool)
  {
    return super.transfer(recipient, amount);
  }

  /// @inheritdoc ERC20Upgradeable
  function transferFrom(
    address holder,
    address recipient,
    uint256 amount
  ) public override(ERC20Upgradeable) returns (bool) {
    return super.transferFrom(holder, recipient, amount);
  }

  /*
    Extended ERC2771
  */

  /// @notice Allows Contract's owner to change the trusted forwarder
  /// @dev should be declared here because we need to protect calls with onlyOwner
  /// @param forwarder New tructed forwarder's address
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
    return ERC2771ContextUpgradeable._msgSender();
  }

  function _msgData()
    internal
    view
    virtual
    override(ContextUpgradeable, ERC2771ContextUpgradeable)
    returns (bytes calldata)
  {
    return ERC2771ContextUpgradeable._msgData();
  }
}
