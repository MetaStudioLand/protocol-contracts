import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber, constants, Signature} from "ethers";
import {splitSignature} from "ethers/lib/utils";
import {ethers} from "hardhat";
import {Context} from "mocha";
import {data712, domainSeparator} from "../helpers/eip712";
import {waitFor} from "../shared/utils";

export function unitTestERC20Permit(): void {
  describe("======== Contract: ERC20 Permit ================================================", async function () {
    const nonce = BigNumber.from("0");
    const deadline = ethers.constants.MaxUint256;

    it("initial nonce is 0", async function () {
      expect(
        await this.token.nonces(this.signers.initialHolder.address)
      ).to.be.equal(BigNumber.from("0"));
    });

    it("domain separator", async function () {
      expect(await this.token.DOMAIN_SEPARATOR()).to.equal(
        await domainSeparator(this.name, "1", this.chainId, this.token)
      );
    });

    async function _buildSignature(
      context: Context,
      owner: SignerWithAddress,
      spender: SignerWithAddress,
      value: BigNumber,
      nonce: BigNumber,
      deadline: BigNumber = ethers.constants.MaxUint256
    ): Promise<Signature> {
      const msgToSign = {
        owner: owner.address,
        spender: spender.address,
        value: value._hex,
        nonce: nonce._hex,
        deadline: deadline._hex,
      };

      const permitData712 = data712(
        context.name,
        context.chainId,
        context.token,
        msgToSign
      );
      const flatSig = await ethers.provider.send("eth_signTypedData_v4", [
        owner.address,
        permitData712,
      ]);
      return splitSignature(flatSig);
    }

    describe("when msg signer == owner", async function () {
      it("ERC20 Approval event is emitted", async function () {
        const sig = await _buildSignature(
          this,
          this.signers.initialHolder,
          this.signers.spender,
          this.initialSupply,
          nonce,
          deadline
        );

        const receipt = await waitFor(
          this.token.permit(
            this.signers.initialHolder.address,
            this.signers.spender.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        );

        expect(receipt)
          .to.emit(this.token, "Approval")
          .withArgs([
            this.signers.initialHolder.address,
            this.signers.spender.address,
            this.initialSupply,
          ]);
      });

      it("nonce for owner should be incremented by 1", async function () {
        const sig = await _buildSignature(
          this,
          this.signers.initialHolder,
          this.signers.spender,
          this.initialSupply,
          nonce
        );

        await waitFor(
          this.token.permit(
            this.signers.initialHolder.address,
            this.signers.spender.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        );
        expect(
          await this.token.nonces(this.signers.initialHolder.address)
        ).to.be.equal("1");
      });

      it("Allowance(owner, spender) should be equal to value", async function () {
        const sig = await _buildSignature(
          this,
          this.signers.initialHolder,
          this.signers.spender,
          this.initialSupply,
          nonce
        );
        await waitFor(
          this.token.permit(
            this.signers.initialHolder.address,
            this.signers.spender.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        );
        expect(
          await this.token.allowance(
            this.signers.initialHolder.address,
            this.signers.spender.address
          )
        ).to.be.equal(this.initialSupply);
      });

      it("rejects reused signature", async function () {
        const sig = await _buildSignature(
          this,
          this.signers.initialHolder,
          this.signers.spender,
          this.initialSupply,
          nonce
        );
        await waitFor(
          this.token.permit(
            this.signers.initialHolder.address,
            this.signers.spender.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        );

        await expect(
          this.token.permit(
            this.signers.initialHolder.address,
            this.signers.spender.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        ).to.be.revertedWith("ERC20Permit: invalid signature");
      });

      it("rejects expired permit", async function () {
        const deadline = BigNumber.from(1382718400);

        const sig = await _buildSignature(
          this,
          this.signers.initialHolder,
          this.signers.spender,
          this.initialSupply,
          nonce,
          deadline
        );
        await expect(
          this.token.permit(
            this.signers.initialHolder.address,
            this.signers.spender.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        ).to.be.revertedWith("ERC20Permit: expired deadline");
      });
    });

    describe("when msg signer != owner", async function () {
      it("rejects other signature", async function () {
        const sig = await _buildSignature(
          this,
          this.signers.anotherAccount,
          this.signers.spender,
          this.initialSupply,
          nonce
        );
        await expect(
          this.token.permit(
            this.signers.initialHolder.address,
            this.signers.spender.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        ).to.be.revertedWith("ERC20Permit: invalid signature");
      });

      it("reverts if owner is zeroAddress", async function () {
        const sig = await _buildSignature(
          this,
          this.signers.initialHolder,
          this.signers.spender,
          this.initialSupply,
          nonce
        );
        await expect(
          this.token.permit(
            constants.AddressZero,
            this.signers.spender.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        ).to.be.revertedWith("ERC20Permit: invalid signature");
      });

      it("reverts if spender is not the approved spender", async function () {
        const sig = await _buildSignature(
          this,
          this.signers.initialHolder,
          this.signers.spender,
          this.initialSupply,
          nonce
        );
        await expect(
          this.token.permit(
            this.signers.initialHolder.address,
            this.signers.anotherAccount.address,
            this.initialSupply,
            deadline,
            sig.v,
            sig.r,
            sig.s
          )
        ).to.be.revertedWith("ERC20Permit: invalid signature");
      });
    });
  });
}
