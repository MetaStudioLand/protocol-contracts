import {expect} from "chai";
import {keccak256, toUtf8Bytes} from "ethers/lib/utils";
import {keys as _keys, map as _map} from "lodash";

const INTERFACES: {[k: string]: string[]} = {
  ERC165: ["supportsInterface(bytes4)"],
  ERC20: [
    "totalSupply()",
    "balanceOf(address)",
    "transfer(address,uint256)",
    "allowance(address,address)",
    "approve(address,uint256)",
    "transferFrom(address,address,uint256)",
  ],
  Pausable: ["paused()", "pause()", "unpause()"],
  ERC2771: ["isTrustedForwarder(address)"],
  ERC1363: [
    "transferAndCall(address,uint256)",
    "transferAndCall(address,uint256,bytes)",
    "transferFromAndCall(address,address,uint256)",
    "transferFromAndCall(address,address,uint256,bytes)",
    "approveAndCall(address,uint256)",
    "approveAndCall(address,uint256,bytes)",
  ],
  ERC1363Transfert: [
    "transferAndCall(address,uint256)",
    "transferAndCall(address,uint256,bytes)",
    "transferFromAndCall(address,address,uint256)",
    "transferFromAndCall(address,address,uint256,bytes)",
  ],
  ERC1363Approve: [
    "approveAndCall(address,uint256)",
    "approveAndCall(address,uint256,bytes)",
  ],
  ERC721: [
    "balanceOf(address)",
    "ownerOf(uint256)",
    "approve(address,uint256)",
    "getApproved(uint256)",
    "setApprovalForAll(address,bool)",
    "isApprovedForAll(address,address)",
    "transferFrom(address,address,uint256)",
    "safeTransferFrom(address,address,uint256)",
    "safeTransferFrom(address,address,uint256,bytes)",
  ],
  ERC721Enumerable: [
    "totalSupply()",
    "tokenOfOwnerByIndex(address,uint256)",
    "tokenByIndex(uint256)",
  ],
  ERC721Metadata: ["name()", "symbol()", "tokenURI(uint256)"],
  ERC1155: [
    "balanceOf(address,uint256)",
    "balanceOfBatch(address[],uint256[])",
    "setApprovalForAll(address,bool)",
    "isApprovedForAll(address,address)",
    "safeTransferFrom(address,address,uint256,uint256,bytes)",
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
  ],
  ERC1155Receiver: [
    "onERC1155Received(address,address,uint256,uint256,bytes)",
    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)",
  ],
  AccessControl: [
    "hasRole(bytes32,address)",
    "getRoleAdmin(bytes32)",
    "grantRole(bytes32,address)",
    "revokeRole(bytes32,address)",
    "renounceRole(bytes32,address)",
  ],
  AccessControlEnumerable: [
    "getRoleMember(bytes32,uint256)",
    "getRoleMemberCount(bytes32)",
  ],
  Governor: [
    "name()",
    "version()",
    "COUNTING_MODE()",
    "hashProposal(address[],uint256[],bytes[],bytes32)",
    "state(uint256)",
    "proposalSnapshot(uint256)",
    "proposalDeadline(uint256)",
    "votingDelay()",
    "votingPeriod()",
    "quorum(uint256)",
    "getVotes(address,uint256)",
    "hasVoted(uint256,address)",
    "propose(address[],uint256[],bytes[],string)",
    "execute(address[],uint256[],bytes[],bytes32)",
    "castVote(uint256,uint8)",
    "castVoteWithReason(uint256,uint8,string)",
    "castVoteBySig(uint256,uint8,uint8,bytes32,bytes32)",
  ],
  GovernorWithParams: [
    "name()",
    "version()",
    "COUNTING_MODE()",
    "hashProposal(address[],uint256[],bytes[],bytes32)",
    "state(uint256)",
    "proposalSnapshot(uint256)",
    "proposalDeadline(uint256)",
    "votingDelay()",
    "votingPeriod()",
    "quorum(uint256)",
    "getVotes(address,uint256)",
    "getVotesWithParams(address,uint256,bytes)",
    "hasVoted(uint256,address)",
    "propose(address[],uint256[],bytes[],string)",
    "execute(address[],uint256[],bytes[],bytes32)",
    "castVote(uint256,uint8)",
    "castVoteWithReason(uint256,uint8,string)",
    "castVoteWithReasonAndParams(uint256,uint8,string,bytes)",
    "castVoteBySig(uint256,uint8,uint8,bytes32,bytes32)",
    "castVoteWithReasonAndParamsBySig(uint256,uint8,string,bytes,uint8,bytes32,bytes32)",
  ],
  GovernorTimelock: [
    "timelock()",
    "proposalEta(uint256)",
    "queue(address[],uint256[],bytes[],bytes32)",
  ],
  ERC2981: ["royaltyInfo(uint256,uint256)"],
};

function _ERC165(functionSignatures: string[] = []): string {
  const INTERFACE_ID_LENGTH = 4;

  const interfaceIdBuffer = functionSignatures
    .map((signature) => keccak256(toUtf8Bytes(signature))) // keccak256
    .map(
      (h) => Buffer.from(h.substring(2), "hex").slice(0, 4) // bytes4()
    )
    .reduce((memo, bytes) => {
      for (let i = 0; i < INTERFACE_ID_LENGTH; i++) {
        memo[i] = memo[i] ^ bytes[i]; // xor
      }
      return memo;
    }, Buffer.alloc(INTERFACE_ID_LENGTH));

  return `0x${interfaceIdBuffer.toString("hex")}`;
}

const INTERFACE_IDS: {[k: string]: string} = {};
const FN_SIGNATURES: {[k: string]: string} = {};
for (const k of Object.getOwnPropertyNames(INTERFACES)) {
  INTERFACE_IDS[k] = _ERC165(INTERFACES[k]);
  for (const fnName of INTERFACES[k]) {
    // the interface id of a single function is equivalent to its function signature
    FN_SIGNATURES[fnName] = _ERC165([fnName]);
  }
}

export function shouldSupportInterface(interfaceName: string) {
  describe(`ERC165 is checking ${interfaceName}...`, function () {
    // FIXME How to convert to ethers.js ?
    // it("supportsInterface uses less than 30k gas", async function () {
    //   for (const k of interfaces) {
    //     const interfaceId = INTERFACE_IDS[k];
    //     expect(
    //       await this.token.supportsInterface.estimateGas(
    //         interfaceId
    //       )
    //     ).to.be.lte(30000);
    //   }
    // });

    it("interface is reported as supported", async function () {
      const interfaceId = INTERFACE_IDS[interfaceName];
      expect(await this.token.supportsInterface(interfaceId)).to.equal(true);
    });

    it("interface's functions are in ABI", function () {
      const fnSignatures = _map(
        _keys(this.token.interface.functions),
        function (value) {
          return _ERC165([value]);
        }
      );
      for (const fnName of INTERFACES[interfaceName]) {
        const fnSig = FN_SIGNATURES[fnName];
        expect(
          fnSignatures.filter((sig: string) => sig === fnSig).length
        ).to.equal(1);
      }
    });
  });
}
