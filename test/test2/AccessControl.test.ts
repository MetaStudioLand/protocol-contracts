import {getSuiteContext} from "../shared/utils";
import {
  shouldBehaveLikeAccessControl,
  shouldBehaveLikeAccessControlEnumerable,
} from "./behaviors/AccessControl.behavior";

export function unitTestAccessControl(): void {
  describe("======== Contract: AccessControl ================================================", async function () {
    const {signers} = getSuiteContext(this);
    shouldBehaveLikeAccessControl(
      "AccessControl",
      signers.initialHolder,
      signers.owner,
      signers.spender,
      signers.recipient
    );
    shouldBehaveLikeAccessControlEnumerable(
      "AccessControl",
      signers.initialHolder,
      signers.owner,
      signers.spender,
      signers.recipient
    );
  });
}
