import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber} from "ethers";
import {keccak256, toUtf8Bytes} from "ethers/lib/utils";
import {shouldSupportInterface} from "./SupportsInterface.behavior";

const ROLES_ADMIN_ROLE = keccak256(toUtf8Bytes("ROLES_ADMIN_ROLE"));
const PROXY_ROLE = keccak256(toUtf8Bytes("PROXY_ROLE"));
const FORWARDER_ROLE = keccak256(toUtf8Bytes("FORWARDER_ROLE"));
const PAUSER_ROLE = keccak256(toUtf8Bytes("PAUSER_ROLE"));

export function shouldBehaveLikeAccessControl(
  errorPrefix: string,
  tokenOwner: SignerWithAddress,
  authorized: SignerWithAddress,
  other: SignerWithAddress,
  otherAdmin: SignerWithAddress
) {
  shouldSupportInterface("AccessControl");

  describe("default admin", function () {
    it("deployer has default admin role", async function () {
      expect(
        await this.token.hasRole(ROLES_ADMIN_ROLE, tokenOwner.address)
      ).to.equal(true);
    });

    it("other roles's admin is the default admin role", async function () {
      expect(await this.token.getRoleAdmin(PROXY_ROLE)).to.equal(
        ROLES_ADMIN_ROLE
      );
    });

    it("default admin role's admin is itself", async function () {
      expect(await this.token.getRoleAdmin(ROLES_ADMIN_ROLE)).to.equal(
        ROLES_ADMIN_ROLE
      );
    });
  });

  describe("granting", function () {
    beforeEach(async function () {
      await this.token
        .connect(tokenOwner)
        .grantRole(PROXY_ROLE, authorized.address);
    });

    it("non-admin cannot grant role to other accounts", async function () {
      // await expectRevert(
      //   this.token.grantRole(ADMIN_ROLE, authorized, {from: other}),
      //   `${errorPrefix}: account ${other.toLowerCase()} is missing role ${ROLES_ADMIN_ROLE}`
      // );
      expect(
        this.token.connect(other).grantRole(PROXY_ROLE, authorized.address)
      ).to.be.revertedWith(
        `${errorPrefix}: account ${other.address.toLowerCase()} is missing role ${ROLES_ADMIN_ROLE}`
      );
    });

    it("granting a role raise event RoleGranted", async function () {
      expect(
        await this.token
          .connect(tokenOwner)
          .grantRole(PROXY_ROLE, authorized.address)
      )
        .emit(this.token, "RoleGranted")
        .withArgs(PROXY_ROLE, authorized.address, tokenOwner.address);
    });

    it("accounts can be granted a role multiple times, but only one event", async function () {
      await this.token
        .connect(tokenOwner)
        .grantRole(PROXY_ROLE, authorized.address);
      expect(
        await this.token
          .connect(tokenOwner)
          .grantRole(PROXY_ROLE, authorized.address)
      ).to.not.emit(this.token, "RoleGranted");
    });
  });

  describe("revoking", function () {
    it("roles that are not had can be revoked", async function () {
      expect(await this.token.hasRole(PROXY_ROLE, authorized.address)).to.equal(
        false
      );

      expect(
        await this.token
          .connect(tokenOwner)
          .revokeRole(PROXY_ROLE, authorized.address)
      ).to.not.emit(this.token, "RoleRevoked");
    });

    context("with granted role", function () {
      beforeEach(async function () {
        await this.token
          .connect(tokenOwner)
          .grantRole(PROXY_ROLE, authorized.address);
      });

      it("admin can revoke role", async function () {
        expect(
          await this.token
            .connect(tokenOwner)
            .revokeRole(PROXY_ROLE, authorized.address)
        )
          .emit(this.token, "RoleRevoked")
          .withArgs(PROXY_ROLE, authorized.address, tokenOwner.address);

        expect(
          await this.token.hasRole(PROXY_ROLE, authorized.address)
        ).to.equal(false);
      });

      it("non-admin cannot revoke role", async function () {
        // await expectRevert(
        //   this.token.revokeRole(ADMIN_ROLE, authorized, {from: other}),
        //   `${errorPrefix}: account ${other.toLowerCase()} is missing role ${ROLES_ADMIN_ROLE}`
        // );
        expect(
          this.token.connect(other).revokeRole(PROXY_ROLE, authorized.address)
        ).to.be.revertedWith(
          `${errorPrefix}: account ${other.address.toLowerCase()} is missing role ${ROLES_ADMIN_ROLE}`
        );
      });

      it("a role can be revoked multiple times", async function () {
        await this.token
          .connect(tokenOwner)
          .revokeRole(PROXY_ROLE, authorized.address);

        expect(
          await this.token
            .connect(tokenOwner)
            .revokeRole(PROXY_ROLE, authorized.address)
        ).to.not.emit(this.token, "RoleRevoked");
      });
    });
  });

  describe("renouncing", function () {
    it("roles that are not had can be renounced", async function () {
      expect(
        await this.token
          .connect(authorized)
          .renounceRole(PROXY_ROLE, authorized.address)
      )
        .to.emit(this.token, "RoleRevoked")
        .withArgs(PROXY_ROLE, authorized.address, authorized.address);
    });

    context("with granted role", function () {
      beforeEach(async function () {
        await this.token
          .connect(tokenOwner)
          .grantRole(PROXY_ROLE, authorized.address);
      });

      it("bearer can renounce role", async function () {
        expect(
          await this.token
            .connect(authorized)
            .renounceRole(PROXY_ROLE, authorized.address)
        )
          .to.emit(this.token, "RoleRevoked")
          .withArgs(PROXY_ROLE, authorized.address, authorized.address);

        expect(
          await this.token.hasRole(PROXY_ROLE, authorized.address)
        ).to.equal(false);
      });

      it("only the sender can renounce their roles", async function () {
        await expect(
          this.token
            .connect(tokenOwner)
            .renounceRole(PROXY_ROLE, authorized.address)
        ).to.revertedWith(`${errorPrefix}: can only renounce roles for self`);
      });

      it("a role can be renounced multiple times", async function () {
        await this.token
          .connect(authorized)
          .renounceRole(PROXY_ROLE, authorized.address);

        expect(
          await this.token
            .connect(authorized)
            .renounceRole(PROXY_ROLE, authorized.address)
        ).to.not.emit(this.token, "RoleRevoked");
      });
    });
  });

  // FIXME Not available in MetaStudioToken
  // describe("setting role admin", function () {
  //   beforeEach(async function () {
  //     expect(await this.token.setRoleAdmin(ADMIN_ROLE, PAUSER_ROLE))
  //       .to.emit(this.token, "RoleAdminChanged")
  //       .withArgs(ADMIN_ROLE, ROLES_ADMIN_ROLE, PAUSER_ROLE);
  //
  //     await this.token
  //       .connect(admin)
  //       .grantRole(PAUSER_ROLE, otherAdmin.address);
  //   });
  //
  //   it("a role's admin role can be changed", async function () {
  //     expect(await this.token.getRoleAdmin(ADMIN_ROLE)).to.equal(PAUSER_ROLE);
  //   });
  //
  //   it("the new admin can grant roles", async function () {
  //     expect(
  //       await this.token
  //         .connect(otherAdmin)
  //         .grantRole(ADMIN_ROLE, authorized.address)
  //     )
  //       .to.emit(this.token, "RoleGranted")
  //       .withArgs(ADMIN_ROLE, authorized.address, otherAdmin.address);
  //   });
  //
  //   it("the new admin can revoke roles", async function () {
  //     await this.token
  //       .connect(otherAdmin)
  //       .grantRole(ADMIN_ROLE, authorized.address);
  //     expect(
  //       await this.token.revokeRole(ADMIN_ROLE, authorized, {
  //         from: otherAdmin,
  //       })
  //     )
  //       .to.emit(this.token, "RoleRevoked")
  //       .withArgs(ADMIN_ROLE, authorized.address, otherAdmin.address);
  //   });
  //
  //   it("a role's previous admins no longer grant roles", async function () {
  //     await expect(
  //       this.token.connect(admin).grantRole(ADMIN_ROLE, authorized.address)
  //     ).to.revertedWith(
  //       `${errorPrefix}: account ${admin.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
  //     );
  //   });
  //
  //   it("a role's previous admins no longer revoke roles", async function () {
  //     await expect(
  //       this.token.connect(admin).revokeRole(ADMIN_ROLE, authorized.address)
  //     ).to.revertedWith(
  //       `${errorPrefix}: account ${admin.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
  //     );
  //   });
  // });

  describe("onlyRole modifier", function () {
    beforeEach(async function () {
      await this.token
        .connect(tokenOwner)
        .grantRole(FORWARDER_ROLE, authorized.address);
    });

    it("do not revert if sender has role", async function () {
      await this.token.connect(authorized).setTrustedForwarder(other.address);
    });

    it("revert if sender doesn't have role #1", async function () {
      await expect(
        this.token.connect(other).setTrustedForwarder(other.address)
      ).to.revertedWith(
        `${errorPrefix}: account ${other.address.toLowerCase()} is missing role ${FORWARDER_ROLE}`
      );
    });

    it("revert if sender doesn't have role #2", async function () {
      await expect(this.token.connect(authorized).pause()).to.revertedWith(
        `${errorPrefix}: account ${authorized.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
      );
    });
  });
}

export function shouldBehaveLikeAccessControlEnumerable(
  errorPrefix: string,
  tokenOwner: SignerWithAddress,
  authorized: SignerWithAddress,
  other: SignerWithAddress,
  otherAuthorized: SignerWithAddress
) {
  shouldSupportInterface("AccessControlEnumerable");

  describe("enumerating", function () {
    it("role bearers can be enumerated", async function () {
      await this.token
        .connect(tokenOwner)
        .grantRole(PROXY_ROLE, authorized.address);
      await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, other.address);
      await this.token
        .connect(tokenOwner)
        .grantRole(PROXY_ROLE, otherAuthorized.address);
      await this.token
        .connect(tokenOwner)
        .revokeRole(PROXY_ROLE, other.address);

      // tokenOwner has PROXY_ROLE by default
      const memberCount = await this.token.getRoleMemberCount(PROXY_ROLE);
      expect(memberCount).to.equal(3);

      const bearers = [];
      for (let i = 0; i < memberCount; ++i) {
        bearers.push(await this.token.getRoleMember(PROXY_ROLE, i));
      }
      expect(bearers).to.have.members([
        tokenOwner.address,
        authorized.address,
        otherAuthorized.address,
      ]);
    });

    it("role enumeration should be in sync after renounceRole call", async function () {
      const memberCount = await this.token.getRoleMemberCount(PROXY_ROLE);
      await this.token
        .connect(tokenOwner)
        .grantRole(PROXY_ROLE, authorized.address);

      expect(await this.token.getRoleMemberCount(PROXY_ROLE)).to.equal(
        BigNumber.from(memberCount).add(1)
      );

      await this.token
        .connect(tokenOwner)
        .renounceRole(PROXY_ROLE, tokenOwner.address);
      expect(await this.token.getRoleMemberCount(PROXY_ROLE)).to.equal(
        memberCount
      );
    });
  });
}
