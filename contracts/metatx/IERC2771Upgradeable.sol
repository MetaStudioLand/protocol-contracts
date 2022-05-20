// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";

interface IERC2771Upgradeable is IERC165Upgradeable {
    function isTrustedForwarded(address) external view returns (bool);
}
