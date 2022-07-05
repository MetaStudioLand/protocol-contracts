// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

/// @title Interface "Pausable"
interface IPausable {
  /// @notice Return true if contract is in `Pause` state
  function paused() external view returns (bool);

  /// @notice Set the contract in pause. No transfert is allowed
  function pause() external;

  /// @notice Set the contract in ready state. Transferts are allowed
  function unpause() external;
}
