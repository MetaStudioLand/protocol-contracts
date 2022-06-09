// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "./IERC2771Upgradeable.sol";

/**
 * @dev Implementing updatable Trusted forwarder
 */
contract ERC2771ContextUpgradeable is Initializable, ContextUpgradeable, IERC2771Upgradeable {
  address private _trustedForwarder;

  event TrustedForwarderChanged(address oldTF, address newTF);

  function __ERC2771_init(address forwarder) internal onlyInitializing {
    if (forwarder != address(0)) {
      _setTrustedForwarder(forwarder);
    }
  }

  function isTrustedForwarder(address forwarder) public view virtual override returns (bool) {
    return forwarder == _trustedForwarder;
  }

  /**
   * @dev Only callable by the owner. Allows change of the trusted forwarder (in case of bankrupt)
   */
  function _setTrustedForwarder(address forwarder) internal {
    address currentTrustedForwarder = _trustedForwarder;
    _trustedForwarder = forwarder;
    emit TrustedForwarderChanged(currentTrustedForwarder, forwarder);
  }

  function _msgSender() internal view virtual override(ContextUpgradeable) returns (address sender) {
    if (isTrustedForwarder(msg.sender)) {
      // The assembly code is more direct than the Solidity version using `abi.decode`.
      assembly {
        sender := shr(96, calldataload(sub(calldatasize(), 20)))
      }
    } else {
      return super._msgSender();
    }
  }

  function _msgData() internal view virtual override(ContextUpgradeable) returns (bytes calldata) {
    if (isTrustedForwarder(msg.sender)) {
      return msg.data[:msg.data.length - 20];
    } else {
      return super._msgData();
    }
  }

  /**
   * @dev This empty reserved space is put in place to allow future versions to add new
   * variables without shifting down storage in the inheritance chain.
   * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
   */
  uint256[49] private __gap;
}
