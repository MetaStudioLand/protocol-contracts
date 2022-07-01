import {shouldBehaveLikeAccessControl} from "./behaviors/AccessControl.behavior";

export function unitTestAccessControl(): void {
  describe("======== Contract: AccessControl ================================================", async function () {
    shouldBehaveLikeAccessControl("AccessControl");
  });
}
