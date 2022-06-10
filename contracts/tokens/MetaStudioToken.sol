// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";
import "../metatx/ERC2771ContextUpgradeable.sol";
import "../metatx/IERC2771Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1363Upgradeable.sol";
import "../ERC1363/ERC1363ContextUpgradeable.sol";
/// @custom:security-contact blockchain-team@iorga.com:
contract MetaStudioToken is
    IERC165Upgradeable,
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ERC20PermitUpgradeable,
    ERC20VotesUpgradeable,
    UUPSUpgradeable,
    ERC2771ContextUpgradeable,
    ERC1363ContextUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address tokensOwner, address forwarder) external initializer {
        require(tokensOwner != address(0), "tokensOwner is mandatory");

        __ERC20_init("MetaStudioToken", "SMV");
        __Ownable_init();
        __ERC2771_init(forwarder);
        __Pausable_init();
        __ERC20Permit_init("MetaStudioToken");
        __ERC20Votes_init();
        __UUPSUpgradeable_init();

        _mint(tokensOwner, 5_000_000_000 * 10 ** decimals());
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
            interfaceId == type(IERC2771Upgradeable).interfaceId|| 
            ;            
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

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    // The following functions are overrides required by Solidity.

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

    /// @dev should be declared here because we need to protect calls with onlyOwner
    function setTrustedForwarder(address forwarder) external onlyOwner {
        super._setTrustedForwarder(forwarder);
    }

    function _msgSender() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (address sender) {
        return super._msgSender();
    }

    function _msgData() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (bytes calldata) {
        return super._msgData();
    }    
}
