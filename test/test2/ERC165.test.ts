import {shouldSupportInterface} from "./behaviors/SupportsInterface.behavior";

export function unitTestERC165() {
  describe("======== Contract: ERC165 ================================================", function () {
    describe("should support interface ERC165", function () {
      shouldSupportInterface("ERC165");
    });

    describe("ERC20 and extensions", function () {
      shouldSupportInterface("ERC20");
      shouldSupportInterface("AccessControl");
      shouldSupportInterface("Pausable");
    });

    describe("Others", function () {
      shouldSupportInterface("ERC2771");
      shouldSupportInterface("ERC1363");
    });
  });
}
