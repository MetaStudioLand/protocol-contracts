import {baseContext} from "./shared/contexts";
import {unitTestERC20} from "./test2/10-ERC20.test";
import {unitTestOwnable} from "./test2/20-Ownable.test";
import {unitTestPausable} from "./test2/30-Pausable.test";

baseContext("MetaStudioToken", function () {
  unitTestERC20();
  unitTestOwnable();
  unitTestPausable();
});
