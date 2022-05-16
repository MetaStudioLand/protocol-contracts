// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @dev Implementing updatable Trusted forwarder
 */
contract ERC2771TrustedForwarderChangeable is 
        Initializable, 
        OwnableUpgradeable {

  address private _trustedForwarder;

  event TrustedForwarderChanged(address oldTF, address newTF);

 /**
  * @dev Initializes the contract setting the deployer as the initial owner.
  */
  function __ERC2771_init(address forwarder) internal onlyInitializing {
    __Ownable_init();
    if (forwarder != address(0)) {
      changeTrustedForwarder(forwarder);
    }
  }

  function changeTrustedForwarder(address forwarder) public onlyOwner {
      address currentTrustedForwarder = _trustedForwarder;
      _trustedForwarder = forwarder;
      emit TrustedForwarderChanged(currentTrustedForwarder, forwarder);
  } 

  function isTrustedForwarder(address forwarder) public view returns (bool) {
      return forwarder == _trustedForwarder;
  }

  /**
   * @dev This empty reserved space is put in place to allow future versions to add new
   * variables without shifting down storage in the inheritance chain.
   * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
   */
  uint256[49] private __gap;
}
