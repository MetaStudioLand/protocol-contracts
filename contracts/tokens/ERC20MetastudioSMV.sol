// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";
 
/// @custom:security-contact blockchain-team@iorga.com: 
contract ERC20MetastudioSMV is IERC165Upgradeable,
        Initializable, 
        ERC20Upgradeable, 
        PausableUpgradeable, 
        OwnableUpgradeable, 
        ERC20PermitUpgradeable, 
        ERC20VotesUpgradeable, 
        UUPSUpgradeable {

    address private _trustedForwarder;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC20_init("ERC20MetastudioSMV", "SMV");
        __Ownable_init();
        __Pausable_init();
        __ERC20Permit_init("ERC20MetastudioSMV");
        __ERC20Votes_init();
        __UUPSUpgradeable_init();

        _mint(msg.sender, 5_000_000_000 * 10 ** decimals());
    }

    function supportsInterface(bytes4 interfaceID) external pure override returns (bool) {
        return interfaceID != 0xffffffff && 
            (
                interfaceID == this.supportsInterface.selector || // ERC165
                interfaceID == 0x36372b07 || // ERC20
                interfaceID == this.isTrustedForwarder.selector || // ERC2771 Meta-TX
                //         ^ this.skinColor.selector // Simpson
                false
            );
    }

    /*
     * ERC2771 forwarder implementation
     */

    event TrustedForwarderChanged(address oldTF, address newTF);

    function changeTrustedForwarder(address forwarder) public onlyOwner onlyProxy {
        address currentTrustedForwarder = _trustedForwarder;
        _trustedForwarder = forwarder;
        emit TrustedForwarderChanged(currentTrustedForwarder, forwarder);
    } 

    function isTrustedForwarder(address forwarder) public view returns (bool) {
        return forwarder == _trustedForwarder;
    }

    function _msgSender() internal view virtual override returns (address sender) {
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

    function _msgData() internal view virtual override returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }

    /*
     * Inheritance extensions
     */

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
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