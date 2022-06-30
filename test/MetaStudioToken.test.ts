import {baseContext} from "./shared/contexts";
import {unitTestERC20} from "./test2/10-ERC20.test";
import {unitTestOwnable} from "./test2/20-Ownable.test";
import {unitTestPausable} from "./test2/30-Pausable.test";
import {unitTestERC2771} from "./test2/ERC2771.test";

baseContext("MetaStudioToken", function () {
  unitTestERC20();
  unitTestOwnable();
  unitTestPausable();
  unitTestERC2771();
});
