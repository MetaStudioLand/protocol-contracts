import {baseContext} from "./shared/contexts";
import {unitTestAccessControl} from "./test2/AccessControl.test";

baseContext("MetaStudioToken", function () {
  // unitTestERC165();
  // unitTestERC20();
  unitTestAccessControl();
  // unitTestPausable();
  // unitTestERC1363();
  // unitTestERC2771();
});
