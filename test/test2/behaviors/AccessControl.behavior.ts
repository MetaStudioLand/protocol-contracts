import {keccak256, toUtf8Bytes} from "ethers/lib/utils";
import {shouldSupportInterface} from "./SupportsInterface.behavior";

const ROLES_ADMIN_ROLE = keccak256(toUtf8Bytes("ROLES_ADMIN_ROLE"));
const ADMIN_ROLE = keccak256(toUtf8Bytes("ADMIN_ROLE"));
const PAUSER_ROLE = keccak256(toUtf8Bytes("PAUSER_ROLE"));

export function shouldBehaveLikeAccessControl(
  errorPrefix: string
  // admin,
  // authorized,
  // other,
  // otherAdmin,
  // otherAuthorized
) {
  shouldSupportInterface("AccessControl");

  // describe("default admin", function () {
  //   it("deployer has default admin role", async function () {
  //     expect(
  //       await this.accessControl.hasRole(ROLES_ADMIN_ROLE, admin)
  //     ).to.equal(true);
  //   });
  //
  //   it("other roles's admin is the default admin role", async function () {
  //     expect(await this.accessControl.getRoleAdmin(ADMIN_ROLE)).to.equal(
  //       ROLES_ADMIN_ROLE
  //     );
  //   });
  //
  //   it("default admin role's admin is itself", async function () {
  //     expect(await this.accessControl.getRoleAdmin(ROLES_ADMIN_ROLE)).to.equal(
  //       ROLES_ADMIN_ROLE
  //     );
  //   });
  // });
  //
  // describe("granting", function () {
  //   beforeEach(async function () {
  //     await this.accessControl.grantRole(ADMIN_ROLE, authorized, {from: admin});
  //   });
  //
  //   it("non-admin cannot grant role to other accounts", async function () {
  //     await expectRevert(
  //       this.accessControl.grantRole(ADMIN_ROLE, authorized, {from: other}),
  //       `${errorPrefix}: account ${other.toLowerCase()} is missing role ${ROLES_ADMIN_ROLE}`
  //     );
  //   });
  //
  //   it("accounts can be granted a role multiple times", async function () {
  //     await this.accessControl.grantRole(ADMIN_ROLE, authorized, {from: admin});
  //     const receipt = await this.accessControl.grantRole(
  //       ADMIN_ROLE,
  //       authorized,
  //       {
  //         from: admin,
  //       }
  //     );
  //     expectEvent.notEmitted(receipt, "RoleGranted");
  //   });
  // });
  //
  // describe("revoking", function () {
  //   it("roles that are not had can be revoked", async function () {
  //     expect(await this.accessControl.hasRole(ADMIN_ROLE, authorized)).to.equal(
  //       false
  //     );
  //
  //     const receipt = await this.accessControl.revokeRole(
  //       ADMIN_ROLE,
  //       authorized,
  //       {
  //         from: admin,
  //       }
  //     );
  //     expectEvent.notEmitted(receipt, "RoleRevoked");
  //   });
  //
  //   context("with granted role", function () {
  //     beforeEach(async function () {
  //       await this.accessControl.grantRole(ADMIN_ROLE, authorized, {
  //         from: admin,
  //       });
  //     });
  //
  //     it("admin can revoke role", async function () {
  //       const receipt = await this.accessControl.revokeRole(
  //         ADMIN_ROLE,
  //         authorized,
  //         {
  //           from: admin,
  //         }
  //       );
  //       expectEvent(receipt, "RoleRevoked", {
  //         account: authorized,
  //         role: ADMIN_ROLE,
  //         sender: admin,
  //       });
  //
  //       expect(
  //         await this.accessControl.hasRole(ADMIN_ROLE, authorized)
  //       ).to.equal(false);
  //     });
  //
  //     it("non-admin cannot revoke role", async function () {
  //       await expectRevert(
  //         this.accessControl.revokeRole(ADMIN_ROLE, authorized, {from: other}),
  //         `${errorPrefix}: account ${other.toLowerCase()} is missing role ${ROLES_ADMIN_ROLE}`
  //       );
  //     });
  //
  //     it("a role can be revoked multiple times", async function () {
  //       await this.accessControl.revokeRole(ADMIN_ROLE, authorized, {
  //         from: admin,
  //       });
  //
  //       const receipt = await this.accessControl.revokeRole(
  //         ADMIN_ROLE,
  //         authorized,
  //         {
  //           from: admin,
  //         }
  //       );
  //       expectEvent.notEmitted(receipt, "RoleRevoked");
  //     });
  //   });
  // });
  //
  // describe("renouncing", function () {
  //   it("roles that are not had can be renounced", async function () {
  //     const receipt = await this.accessControl.renounceRole(
  //       ADMIN_ROLE,
  //       authorized,
  //       {
  //         from: authorized,
  //       }
  //     );
  //     expectEvent.notEmitted(receipt, "RoleRevoked");
  //   });
  //
  //   context("with granted role", function () {
  //     beforeEach(async function () {
  //       await this.accessControl.grantRole(ADMIN_ROLE, authorized, {
  //         from: admin,
  //       });
  //     });
  //
  //     it("bearer can renounce role", async function () {
  //       const receipt = await this.accessControl.renounceRole(
  //         ADMIN_ROLE,
  //         authorized,
  //         {from: authorized}
  //       );
  //       expectEvent(receipt, "RoleRevoked", {
  //         account: authorized,
  //         role: ADMIN_ROLE,
  //         sender: authorized,
  //       });
  //
  //       expect(
  //         await this.accessControl.hasRole(ADMIN_ROLE, authorized)
  //       ).to.equal(false);
  //     });
  //
  //     it("only the sender can renounce their roles", async function () {
  //       await expectRevert(
  //         this.accessControl.renounceRole(ADMIN_ROLE, authorized, {
  //           from: admin,
  //         }),
  //         `${errorPrefix}: can only renounce roles for self`
  //       );
  //     });
  //
  //     it("a role can be renounced multiple times", async function () {
  //       await this.accessControl.renounceRole(ADMIN_ROLE, authorized, {
  //         from: authorized,
  //       });
  //
  //       const receipt = await this.accessControl.renounceRole(
  //         ADMIN_ROLE,
  //         authorized,
  //         {from: authorized}
  //       );
  //       expectEvent.notEmitted(receipt, "RoleRevoked");
  //     });
  //   });
  // });
  //
  // describe("setting role admin", function () {
  //   beforeEach(async function () {
  //     const receipt = await this.accessControl.setRoleAdmin(
  //       ADMIN_ROLE,
  //       PAUSER_ROLE
  //     );
  //     expectEvent(receipt, "RoleAdminChanged", {
  //       role: ADMIN_ROLE,
  //       previousAdminRole: ROLES_ADMIN_ROLE,
  //       newAdminRole: PAUSER_ROLE,
  //     });
  //
  //     await this.accessControl.grantRole(PAUSER_ROLE, otherAdmin, {
  //       from: admin,
  //     });
  //   });
  //
  //   it("a role's admin role can be changed", async function () {
  //     expect(await this.accessControl.getRoleAdmin(ADMIN_ROLE)).to.equal(
  //       PAUSER_ROLE
  //     );
  //   });
  //
  //   it("the new admin can grant roles", async function () {
  //     const receipt = await this.accessControl.grantRole(
  //       ADMIN_ROLE,
  //       authorized,
  //       {
  //         from: otherAdmin,
  //       }
  //     );
  //     expectEvent(receipt, "RoleGranted", {
  //       account: authorized,
  //       role: ADMIN_ROLE,
  //       sender: otherAdmin,
  //     });
  //   });
  //
  //   it("the new admin can revoke roles", async function () {
  //     await this.accessControl.grantRole(ADMIN_ROLE, authorized, {
  //       from: otherAdmin,
  //     });
  //     const receipt = await this.accessControl.revokeRole(
  //       ADMIN_ROLE,
  //       authorized,
  //       {
  //         from: otherAdmin,
  //       }
  //     );
  //     expectEvent(receipt, "RoleRevoked", {
  //       account: authorized,
  //       role: ADMIN_ROLE,
  //       sender: otherAdmin,
  //     });
  //   });
  //
  //   it("a role's previous admins no longer grant roles", async function () {
  //     await expectRevert(
  //       this.accessControl.grantRole(ADMIN_ROLE, authorized, {from: admin}),
  //       `${errorPrefix}: account ${admin.toLowerCase()} is missing role ${PAUSER_ROLE}`
  //     );
  //   });
  //
  //   it("a role's previous admins no longer revoke roles", async function () {
  //     await expectRevert(
  //       this.accessControl.revokeRole(ADMIN_ROLE, authorized, {from: admin}),
  //       `${errorPrefix}: account ${admin.toLowerCase()} is missing role ${PAUSER_ROLE}`
  //     );
  //   });
  // });
  //
  // describe("onlyRole modifier", function () {
  //   beforeEach(async function () {
  //     await this.accessControl.grantRole(ADMIN_ROLE, authorized, {from: admin});
  //   });
  //
  //   it("do not revert if sender has role", async function () {
  //     await this.accessControl.senderProtected(ADMIN_ROLE, {from: authorized});
  //   });
  //
  //   it("revert if sender doesn't have role #1", async function () {
  //     await expectRevert(
  //       this.accessControl.senderProtected(ADMIN_ROLE, {from: other}),
  //       `${errorPrefix}: account ${other.toLowerCase()} is missing role ${ADMIN_ROLE}`
  //     );
  //   });
  //
  //   it("revert if sender doesn't have role #2", async function () {
  //     await expectRevert(
  //       this.accessControl.senderProtected(PAUSER_ROLE, {from: authorized}),
  //       `${errorPrefix}: account ${authorized.toLowerCase()} is missing role ${PAUSER_ROLE}`
  //     );
  //   });
  // });
}

// function shouldBehaveLikeAccessControlEnumerable(
//   errorPrefix,
//   admin,
//   authorized,
//   other,
//   otherAdmin,
//   otherAuthorized
// ) {
//   shouldSupportInterfaces(["AccessControlEnumerable"]);
//
//   describe("enumerating", function () {
//     it("role bearers can be enumerated", async function () {
//       await this.accessControl.grantRole(ADMIN_ROLE, authorized, {from: admin});
//       await this.accessControl.grantRole(ADMIN_ROLE, other, {from: admin});
//       await this.accessControl.grantRole(ADMIN_ROLE, otherAuthorized, {
//         from: admin,
//       });
//       await this.accessControl.revokeRole(ADMIN_ROLE, other, {from: admin});
//
//       const memberCount = await this.accessControl.getRoleMemberCount(
//         ADMIN_ROLE
//       );
//       expect(memberCount).to.bignumber.equal("2");
//
//       const bearers = [];
//       for (let i = 0; i < memberCount; ++i) {
//         bearers.push(await this.accessControl.getRoleMember(ADMIN_ROLE, i));
//       }
//
//       expect(bearers).to.have.members([authorized, otherAuthorized]);
//     });
//     it("role enumeration should be in sync after renounceRole call", async function () {
//       expect(
//         await this.accessControl.getRoleMemberCount(ADMIN_ROLE)
//       ).to.bignumber.equal("0");
//       await this.accessControl.grantRole(ADMIN_ROLE, admin, {from: admin});
//       expect(
//         await this.accessControl.getRoleMemberCount(ADMIN_ROLE)
//       ).to.bignumber.equal("1");
//       await this.accessControl.renounceRole(ADMIN_ROLE, admin, {from: admin});
//       expect(
//         await this.accessControl.getRoleMemberCount(ADMIN_ROLE)
//       ).to.bignumber.equal("0");
//     });
//   });
// }
