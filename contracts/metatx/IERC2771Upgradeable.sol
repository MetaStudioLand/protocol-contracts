// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC2771Upgradeable {
    function isTrustedForwarder(address) external view returns (bool);
}
