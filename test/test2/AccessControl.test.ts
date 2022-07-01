import {getSuiteContext} from "../shared/utils";
import {shouldBehaveLikeAccessControl} from "./behaviors/AccessControl.behavior";

export function unitTestAccessControl(): void {
  describe("======== Contract: AccessControl ================================================", async function () {
    const {signers} = getSuiteContext(this);
    shouldBehaveLikeAccessControl(
      "AccessControl",
      signers.owner,
      signers.spender,
      signers.recipient,
      signers.initialHolder
    );
  });
}
