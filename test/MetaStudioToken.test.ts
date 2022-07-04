import {baseContext} from "./shared/contexts";
import {unitTestERC20} from "./test2/10-ERC20.test";
import {unitTestPausable} from "./test2/30-Pausable.test";
import {unitTestERC1363} from "./test2/40-ERC1363.test";
import {unitTestAccessControl} from "./test2/AccessControl.test";
import {unitTestERC165} from "./test2/ERC165.test";
import {unitTestERC2771} from "./test2/ERC2771.test";
import {unitTestVotes} from "./test2/unitTestVotes.test";
baseContext("MetaStudioToken", function () {
  unitTestERC165();
  unitTestERC20();
  unitTestAccessControl();
  unitTestPausable();
  unitTestERC1363();
  unitTestERC2771();
  unitTestVotes();
});
