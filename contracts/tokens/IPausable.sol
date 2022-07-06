// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

/// @title Interface "Pausable"
/// @dev declaration of Ipausable methodes
interface IPausable {
  /// @notice check if a contract is in `Pause` state
  /// @return Return true if the contract is in `Pause` otherwise false
  function paused() external view returns (bool);

  /// @notice Set the contract in pause. No transfert is allowed
  function pause() external;

  /// @notice Set the contract in ready state. Transferts are allowed
  function unpause() external;
}
