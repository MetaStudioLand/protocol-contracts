// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";
import "./metatx/ERC2771TrustedForwarderChangeable.sol";

/// @custom:security-contact blockchain-team@iorga.com:
contract ERC20MetastudioSMV is
    Initializable,
    ContextUpgradeable,
    ERC20Upgradeable,
    ERC2771TrustedForwarderChangeable,
    PausableUpgradeable,
    ERC20PermitUpgradeable,
    ERC20VotesUpgradeable,
    UUPSUpgradeable,
    IERC165Upgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address tokensOwner) public initializer {
        require(tokensOwner != address(0), "tokensOwner is mandatory");

        __ERC20_init("ERC20MetastudioSMV", "SMV");
        __Context_init();
        __ERC2771_init(address(0));
        __Pausable_init();
        __ERC20Permit_init("ERC20MetastudioSMV");
        __ERC20Votes_init();
        __UUPSUpgradeable_init();

        _mint(tokensOwner, 5_000_000_000 * 10**decimals());
    }

    function supportsInterface(bytes4 interfaceID)
        external
        pure
        override
        returns (bool)
    {
        return
            interfaceID != 0xffffffff &&
            (interfaceID == type(IERC165Upgradeable).interfaceId || // ERC165
                interfaceID == type(IERC20Upgradeable).interfaceId || // ERC20
                interfaceID == this.isTrustedForwarder.selector || // ERC2771 Meta-TX
                //         ^ this.skinColor.selector // Simpson
                false ||
                false);
    }

    /*
     * Inheritance extensions
     */

    function _msgSender()
        internal
        view
        override
        returns (address sender)
    {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            // Call ContextUpgradeable implementation
            return super._msgSender();
        }
    }

    function _msgData()
        internal
        view
        override
        returns (bytes calldata)
    {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
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
}
