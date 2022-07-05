// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
/// @title IERC2771Upgradeable
/// @dev Definition of IERC2771Upgradeable Interface
interface IERC2771Upgradeable {
  /// @notice Checks if an address is to a trusted forwarder
  /// @dev returns true if trusted forwerder otherwise false
  /// @param addr address to check
  /// @return boolean 
  function isTrustedForwarder(address addr) external view returns (bool);
}
