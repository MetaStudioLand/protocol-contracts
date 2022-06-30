// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

/**
 * @dev Simple minimal forwarder to be used together with an ERC2771 compatible contract. See {ERC2771Context}.
 */
contract ERC2771Forwarder {
  struct ForwardRequest {
    address from;
    address to;
    uint256 value;
    uint256 gas;
    uint256 nonce;
    bytes data;
  }

  mapping(address => uint256) private _nonces;

  function getNonce(address from) public view returns (uint256) {
    return _nonces[from];
  }

  event Forwarded(bool, bytes);

  function execute(ForwardRequest calldata req)
    public
    returns (bool, bytes memory)
  {
    _nonces[req.from] = req.nonce + 1;

    (bool success, bytes memory returndata) = req.to.call{
      gas: req.gas,
      value: req.value
    }(abi.encodePacked(req.data, req.from));

    emit Forwarded(success, returndata);
    return (success, returndata);
  }
}
