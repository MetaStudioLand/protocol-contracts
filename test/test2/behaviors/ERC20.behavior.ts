import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber, Contract} from "ethers";
import {ethers} from "hardhat";

export function shouldBehaveLikeERC20(
  initialSupply: BigNumber,
  initialHolder: SignerWithAddress,
  recipient: SignerWithAddress,
  anotherAccount: SignerWithAddress
) {
  describe("total supply", function () {
    it("returns the total amount of tokens", async function () {
      expect(await this.token.totalSupply()).to.be.equal(initialSupply);
    });
  });

  describe("balanceOf", function () {
    describe("when the requested account has no tokens", function () {
      it("returns zero", async function () {
        expect(await this.token.balanceOf(anotherAccount.address)).to.be.equal(
          "0"
        );
      });
    });

    describe("when the requested account has some tokens", function () {
      it("returns the total amount of tokens", async function () {
        expect(await this.token.balanceOf(initialHolder.address)).to.be.equal(
          initialSupply
        );
      });
    });
  });

  describe("transfer", function () {
    shouldBehaveLikeERC20Transfer(initialHolder, recipient, initialSupply);
  });

  describe("transfer from", function () {
    const spender = recipient;

    describe("when the token owner is not the zero address", function () {
      const tokenOwner = initialHolder;

      describe("when the recipient is not the zero address", function () {
        const to = anotherAccount;

        describe("when the spender has enough allowance", function () {
          beforeEach(async function () {
            await this.token
              .connect(initialHolder)
              .approve(spender.address, initialSupply);
          });

          describe("when the token owner has enough balance", function () {
            const amount = initialSupply;

            it("transfers the requested amount", async function () {
              await this.token
                .connect(spender)
                .transferFrom(tokenOwner.address, to.address, amount);

              expect(
                await this.token.balanceOf(tokenOwner.address)
              ).to.be.equal(0);

              expect(await this.token.balanceOf(to.address)).to.be.equal(
                amount
              );
            });

            it("decreases the spender allowance", async function () {
              await this.token
                .connect(spender)
                .transferFrom(tokenOwner.address, to.address, amount);

              expect(
                await this.token.allowance(tokenOwner.address, spender.address)
              ).to.be.equal(0);
            });

            it("emits a transfer event", async function () {
              await expect(
                this.token
                  .connect(spender)
                  .transferFrom(tokenOwner.address, to.address, amount)
              )
                .to.emit(this.token, "Transfer")
                .withArgs(tokenOwner.address, to.address, amount);
            });

            it("emits an approval event", async function () {
              await expect(
                await this.token
                  .connect(spender)
                  .transferFrom(tokenOwner.address, to.address, amount)
              )
                .to.emit(this.token, "Approval")
                .withArgs(
                  tokenOwner.address,
                  spender.address,
                  await this.token.allowance(
                    tokenOwner.address,
                    spender.address
                  )
                );
            });
          });

          describe("when the token owner does not have enough balance", function () {
            const amount = initialSupply;

            beforeEach("reducing balance", async function () {
              await this.token.connect(tokenOwner).transfer(to.address, 1);
            });

            it("reverts", async function () {
              await expect(
                this.token
                  .connect(spender)
                  .transferFrom(tokenOwner.address, to.address, amount)
              ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
            });
          });
        });

        describe("when the spender does not have enough allowance", function () {
          const allowance = initialSupply.sub(1);

          beforeEach(async function () {
            await this.token
              .connect(tokenOwner)
              .approve(spender.address, allowance);
          });

          describe("when the token owner has enough balance", function () {
            const amount = initialSupply;

            it("reverts", async function () {
              await expect(
                this.token
                  .connect(spender)
                  .transferFrom(tokenOwner.address, to.address, amount)
              ).to.be.revertedWith("ERC20: insufficient allowance");
            });
          });

          describe("when the token owner does not have enough balance", function () {
            const amount = allowance;

            beforeEach("reducing balance", async function () {
              await this.token.connect(tokenOwner).transfer(to.address, 2);
            });

            it("reverts", async function () {
              await expect(
                this.token
                  .connect(spender)
                  .transferFrom(tokenOwner.address, to.address, amount)
              ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
            });
          });
        });

        describe("when the spender has unlimited allowance", function () {
          beforeEach(async function () {
            await this.token
              .connect(initialHolder)
              .approve(spender.address, ethers.constants.MaxUint256);
          });

          it("does not decrease the spender allowance", async function () {
            await this.token
              .connect(spender)
              .transferFrom(tokenOwner.address, to.address, 1);

            expect(
              await this.token.allowance(tokenOwner.address, spender.address)
            ).to.be.equal(ethers.constants.MaxUint256);
          });

          it("does not emit an approval event", async function () {
            await expect(
              this.token
                .connect(spender)
                .transferFrom(tokenOwner.address, to.address, 1)
            ).to.not.emit(this.token, "Approval");
          });
        });
      });

      describe("when the recipient is the zero address", function () {
        const amount = initialSupply;
        const to = ethers.constants.AddressZero;

        beforeEach(async function () {
          await this.token.connect(tokenOwner).approve(spender.address, amount);
        });

        it("reverts", async function () {
          await expect(
            this.token
              .connect(spender)
              .transferFrom(tokenOwner.address, to, amount)
          ).to.be.revertedWith("ERC20: transfer to the zero address");
        });
      });
    });

    describe("when the token owner is the zero address", function () {
      const amount = 0;
      const tokenOwner = ethers.constants.AddressZero;
      const to = recipient;

      it("reverts", async function () {
        await expect(
          this.token
            .connect(spender)
            .transferFrom(tokenOwner, to.address, amount)
        ).to.be.revertedWith("from the zero address");
      });
    });
  });

  describe("approve", function () {
    shouldBehaveLikeERC20Approve(initialHolder, recipient, initialSupply);
  });
}

export function shouldBehaveLikeERC20Transfer(
  from: SignerWithAddress,
  to: SignerWithAddress,
  balance: BigNumber,
  useInternal: boolean = false
) {
  const _doTransfer = useInternal
    ? (
        token: Contract,
        from: SignerWithAddress | string,
        to: SignerWithAddress | string,
        amount: BigNumber
      ) => {
        return token.transferInternal(
          typeof from === "string" ? from : from.address,
          typeof to === "string" ? to : to.address,
          amount
        );
      }
    : (
        token: Contract,
        from: SignerWithAddress | string,
        to: SignerWithAddress | string,
        amount: BigNumber
      ) => {
        return token
          .connect(from)
          .transfer(typeof to === "string" ? to : to.address, amount);
      };

  describe("when the recipient is not the zero address", function () {
    describe("when the sender does not have enough balance", function () {
      const amount = balance.add(1);

      it("reverts", async function () {
        await expect(
          _doTransfer(this.token, from, to, amount)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });
    });

    describe("when the sender transfers all balance", function () {
      const amount = balance;

      it("transfers the requested amount", async function () {
        await _doTransfer(this.token, from, to, amount);

        expect(await this.token.balanceOf(from.address)).to.be.equal("0");
        expect(await this.token.balanceOf(to.address)).to.be.equal(amount);
      });

      it("emits a transfer event", async function () {
        await expect(_doTransfer(this.token, from, to, amount))
          .to.emit(this.token, "Transfer")
          .withArgs(from.address, to.address, amount);
      });
    });

    describe("when the sender transfers zero tokens", function () {
      const amount = BigNumber.from("0");

      it("transfers the requested amount", async function () {
        await _doTransfer(this.token, from, to, amount);

        expect(await this.token.balanceOf(from.address)).to.be.equal(balance);

        expect(await this.token.balanceOf(to.address)).to.be.equal(0);
      });

      it("emits a transfer event", async function () {
        await expect(_doTransfer(this.token, from, to, amount))
          .to.emit(this.token, "Transfer")
          .withArgs(from.address, to.address, amount);
      });
    });
  });

  describe("when the recipient is the zero address", function () {
    it("reverts", async function () {
      await expect(
        _doTransfer(this.token, from, ethers.constants.AddressZero, balance)
      ).to.be.revertedWith("ERC20: transfer to the zero address");
    });
  });
}

export function shouldBehaveLikeERC20Approve(
  owner: SignerWithAddress,
  spender: SignerWithAddress,
  supply: BigNumber,
  useInternal: boolean = false
) {
  const _doApprove = useInternal
    ? (
        token: Contract,
        owner: SignerWithAddress | string,
        spender: SignerWithAddress | string,
        amount: BigNumber
      ) => {
        return token.approveInternal(
          typeof owner === "string" ? owner : owner.address,
          typeof spender === "string" ? spender : spender.address,
          amount
        );
      }
    : (
        token: Contract,
        owner: SignerWithAddress | string,
        spender: SignerWithAddress | string,
        amount: BigNumber
      ) => {
        return token
          .connect(owner)
          .approve(
            typeof spender === "string" ? spender : spender.address,
            amount
          );
      };

  describe("when the spender is not the zero address", function () {
    describe("when the sender has enough balance", function () {
      const amount = supply;

      it("emits an approval event", async function () {
        await expect(_doApprove(this.token, owner, spender, amount))
          .to.emit(this.token, "Approval")
          .withArgs(owner.address, spender.address, amount);
      });

      describe("when there was no approved amount before", function () {
        it("approves the requested amount", async function () {
          await _doApprove(this.token, owner, spender, amount);

          expect(
            await this.token.allowance(owner.address, spender.address)
          ).to.be.equal(amount);
        });
      });

      describe("when the spender had an approved amount", function () {
        beforeEach(async function () {
          await _doApprove(this.token, owner, spender, BigNumber.from(1));
        });

        it("approves the requested amount and replaces the previous one", async function () {
          await _doApprove(this.token, owner, spender, amount);

          expect(
            await this.token.allowance(owner.address, spender.address)
          ).to.be.equal(amount);
        });
      });
    });

    describe("when the sender does not have enough balance", function () {
      const amount = supply.add(1);

      it("emits an approval event", async function () {
        await expect(_doApprove(this.token, owner, spender, amount))
          .to.emit(this.token, "Approval")
          .withArgs(owner.address, spender.address, amount);
      });

      describe("when there was no approved amount before", function () {
        it("approves the requested amount", async function () {
          await _doApprove(this.token, owner, spender, amount);

          expect(
            await this.token.allowance(owner.address, spender.address)
          ).to.be.equal(amount);
        });
      });

      describe("when the spender had an approved amount", function () {
        beforeEach(async function () {
          await _doApprove(this.token, owner, spender, BigNumber.from(1));
        });

        it("approves the requested amount and replaces the previous one", async function () {
          await _doApprove(this.token, owner, spender, amount);

          expect(
            await this.token.allowance(owner.address, spender.address)
          ).to.be.equal(amount);
        });
      });
    });
  });

  describe("when the spender is the zero address", function () {
    it("reverts", async function () {
      await expect(
        _doApprove(this.token, owner, ethers.constants.AddressZero, supply)
      ).to.be.revertedWith("ERC20: approve to the zero address");
    });
  });
}
