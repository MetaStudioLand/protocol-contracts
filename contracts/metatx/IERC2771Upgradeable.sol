// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
/// @title Definition of IERC2771Upgradeable Interface
interface IERC2771Upgradeable {
  function isTrustedForwarder(address) external view returns (bool);
}
