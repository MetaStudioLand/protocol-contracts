import {baseContext} from "./shared/contexts";
import {unitTestERC2771} from "./test2/40-ERC2771.test";

baseContext("MetaStudioToken", function () {
  // unitTestERC20();
  // unitTestOwnable();
  // unitTestPausable();
  unitTestERC2771();
});
