import {expect} from "chai";
import {BigNumber} from "ethers";
import {Address} from "hardhat-deploy/types";
import {
  DEFAULT_ADMIN_ROLE,
  FORWARDER_ROLE,
  PAUSER_ROLE,
  PROXY_ROLE,
} from "../../../shared/constants";
import {shouldSupportInterface} from "./SupportsInterface.behavior";

export function shouldBehaveLikeAccessControl(
  errorPrefix: string,
  tokenOwner: Address,
  authorized: Address,
  other: Address,
  otherAdmin: Address
) {
  shouldSupportInterface("AccessControl");

  describe("default admin", function () {
    it("deployer has default admin role", async function () {
      expect(await this.token.hasRole(DEFAULT_ADMIN_ROLE, tokenOwner)).to.equal(
        true
      );
    });

    it("other roles's admin is the default admin role", async function () {
      expect(await this.token.getRoleAdmin(PROXY_ROLE)).to.equal(
        DEFAULT_ADMIN_ROLE
      );
    });

    it("default admin role's admin is itself", async function () {
      expect(await this.token.getRoleAdmin(DEFAULT_ADMIN_ROLE)).to.equal(
        DEFAULT_ADMIN_ROLE
      );
    });
  });

  describe("granting", function () {
    beforeEach(async function () {
      await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, authorized);
    });

    it("non-admin cannot grant role to other accounts", async function () {
      expect(
        this.token.connect(other).grantRole(PROXY_ROLE, authorized)
      ).to.be.revertedWith(
        `${errorPrefix}: account ${other.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
      );
    });

    it("granting a role raise event RoleGranted", async function () {
      expect(
        await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, authorized)
      )
        .emit(this.token, "RoleGranted")
        .withArgs(PROXY_ROLE, authorized, tokenOwner);
    });

    it("accounts can be granted a role multiple times, but only one event", async function () {
      await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, authorized);
      expect(
        await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, authorized)
      ).to.not.emit(this.token, "RoleGranted");
    });
  });

  describe("revoking", function () {
    it("roles that are not had can be revoked", async function () {
      expect(await this.token.hasRole(PROXY_ROLE, authorized)).to.equal(false);

      expect(
        await this.token.connect(tokenOwner).revokeRole(PROXY_ROLE, authorized)
      ).to.not.emit(this.token, "RoleRevoked");
    });

    context("with granted role", function () {
      beforeEach(async function () {
        await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, authorized);
      });

      it("admin can revoke role", async function () {
        expect(
          await this.token
            .connect(tokenOwner)
            .revokeRole(PROXY_ROLE, authorized)
        )
          .emit(this.token, "RoleRevoked")
          .withArgs(PROXY_ROLE, authorized, tokenOwner);

        expect(await this.token.hasRole(PROXY_ROLE, authorized)).to.equal(
          false
        );
      });

      it("non-admin cannot revoke role", async function () {
        expect(
          this.token.connect(other).revokeRole(PROXY_ROLE, authorized)
        ).to.be.revertedWith(
          `${errorPrefix}: account ${other.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
        );
      });

      it("a role can be revoked multiple times", async function () {
        await this.token.connect(tokenOwner).revokeRole(PROXY_ROLE, authorized);

        expect(
          await this.token
            .connect(tokenOwner)
            .revokeRole(PROXY_ROLE, authorized)
        ).to.not.emit(this.token, "RoleRevoked");
      });
    });
  });

  describe("renouncing", function () {
    it("roles that are not had can be renounced", async function () {
      expect(
        await this.token
          .connect(authorized)
          .renounceRole(PROXY_ROLE, authorized)
      )
        .to.emit(this.token, "RoleRevoked")
        .withArgs(PROXY_ROLE, authorized, authorized);
    });

    context("with granted role", function () {
      beforeEach(async function () {
        await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, authorized);
      });

      it("bearer can renounce role", async function () {
        expect(
          await this.token
            .connect(authorized)
            .renounceRole(PROXY_ROLE, authorized)
        )
          .to.emit(this.token, "RoleRevoked")
          .withArgs(PROXY_ROLE, authorized, authorized);

        expect(await this.token.hasRole(PROXY_ROLE, authorized)).to.equal(
          false
        );
      });

      it("only the sender can renounce their roles", async function () {
        await expect(
          this.token.connect(tokenOwner).renounceRole(PROXY_ROLE, authorized)
        ).to.revertedWith(`${errorPrefix}: can only renounce roles for self`);
      });

      it("a role can be renounced multiple times", async function () {
        await this.token
          .connect(authorized)
          .renounceRole(PROXY_ROLE, authorized);

        expect(
          await this.token
            .connect(authorized)
            .renounceRole(PROXY_ROLE, authorized)
        ).to.not.emit(this.token, "RoleRevoked");
      });
    });
  });

  describe("onlyRole modifier", function () {
    beforeEach(async function () {
      await this.token
        .connect(tokenOwner)
        .grantRole(FORWARDER_ROLE, authorized);
    });

    it("do not revert if sender has role", async function () {
      await this.token.connect(authorized).setTrustedForwarder(other);
    });

    it("revert if sender doesn't have role #1", async function () {
      await expect(
        this.token.connect(other).setTrustedForwarder(other)
      ).to.revertedWith(
        `${errorPrefix}: account ${other.toLowerCase()} is missing role ${FORWARDER_ROLE}`
      );
    });

    it("revert if sender doesn't have role #2", async function () {
      await expect(this.token.connect(authorized).pause()).to.revertedWith(
        `${errorPrefix}: account ${authorized.toLowerCase()} is missing role ${PAUSER_ROLE}`
      );
    });
  });
}

export function shouldBehaveLikeAccessControlEnumerable(
  errorPrefix: string,
  tokenOwner: Address,
  authorized: Address,
  other: Address,
  otherAuthorized: Address
) {
  shouldSupportInterface("AccessControlEnumerable");

  describe("enumerating", function () {
    // it("role bearers can be enumerated", async function () {
    //   await this.token
    //     .connect(tokenOwner)
    //     .grantRole(PROXY_ROLE, authorized);
    //   await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, other);
    //   await this.token
    //     .connect(tokenOwner)
    //     .grantRole(PROXY_ROLE, otherauthorized);
    //   await this.token
    //     .connect(tokenOwner)
    //     .revokeRole(PROXY_ROLE, other);

    //   // tokenOwner has PROXY_ROLE by default
    //   const memberCount = await this.token.getRoleMemberCount(PROXY_ROLE);
    //   expect(memberCount).to.equal(3);

    //   const bearers = [];
    //   for (let i = 0; i < memberCount; ++i) {
    //     bearers.push(await this.token.getRoleMember(PROXY_ROLE, i));
    //   }
    //   expect(bearers).to.have.members([
    //     tokenOwner,
    //     authorized,
    //     otherauthorized,
    //   ]);
    // });

    it("role enumeration should be in sync after renounceRole call", async function () {
      const memberCount = await this.token.getRoleMemberCount(PROXY_ROLE);
      await this.token.connect(tokenOwner).grantRole(PROXY_ROLE, authorized);

      expect(await this.token.getRoleMemberCount(PROXY_ROLE)).to.equal(
        BigNumber.from(memberCount).add(1)
      );

      await this.token.connect(tokenOwner).renounceRole(PROXY_ROLE, tokenOwner);
      expect(await this.token.getRoleMemberCount(PROXY_ROLE)).to.equal(
        memberCount
      );
    });
  });
}
