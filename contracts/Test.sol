// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract Test {
  uint256 public variable;

  constructor() {
    variable = 100;
  }

  function getVariable() external view returns (uint256) {
    return variable;
  }
}
