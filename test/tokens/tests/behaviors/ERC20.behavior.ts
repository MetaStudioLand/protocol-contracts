import {expect} from "chai";
import {BigNumber, Contract} from "ethers";
import {ethers} from "hardhat";
import {Address} from "hardhat-deploy/types";

export function shouldBehaveLikeERC20(
  initialSupply: BigNumber,
  initialHolder: Address,
  recipient: Address,
  anotherAccount: Address
) {
  describe("total supply", function () {
    it("returns the total amount of tokens", async function () {
      expect(await this.token.totalSupply()).to.be.equal(initialSupply);
    });
  });

  describe("balanceOf", function () {
    describe("when the requested account has no tokens", function () {
      it("returns zero", async function () {
        expect(await this.token.balanceOf(anotherAccount)).to.be.equal("0");
      });
    });

    describe("when the requested account has some tokens", function () {
      it("returns the total amount of tokens", async function () {
        expect(await this.token.balanceOf(initialHolder)).to.be.equal(
          initialSupply
        );
      });
    });
  });

  describe("transfer", function () {
    shouldBehaveLikeERC20Transfer(
      initialHolder,
      recipient,
      initialSupply,
      function (
        token: Contract,
        from: Address | string,
        to: Address | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        return token.connect(from).transfer(to, amount);
      }
    );
  });

  describe("transfer from", function () {
    shouldBehaveLikeERC20TransferFrom(
      recipient,
      initialHolder,
      anotherAccount,
      initialSupply,
      async function (
        token: Contract,
        spender: Address | string,
        tokenOwner: Address | string,
        to: Address | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        return token.connect(spender).transferFrom(tokenOwner, to, amount);
      }
    );
  });

  describe("approve", function () {
    shouldBehaveLikeERC20Approve(
      initialHolder,
      recipient,
      initialSupply,
      async function (
        token: Contract,
        owner: Address | string,
        spender: Address | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        return token.connect(owner).approve(spender, amount);
      }
    );
  });
}

export function shouldBehaveLikeERC20Transfer(
  from: Address,
  to: Address,
  balance: BigNumber,
  doTransfer: (
    token: Contract,
    from: Address | string,
    to: Address | string,
    amount: BigNumber,
    forwarder: Contract | null
  ) => Promise<any>
) {
  describe("when the recipient is not the zero address", function () {
    describe("when the sender does not have enough balance", function () {
      const amount = balance.add(1);

      it("reverts", async function () {
        await expect(
          doTransfer(this.token, from, to, amount, this.forwarder)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });
    });

    describe("when the sender transfers all balance", function () {
      const amount = balance;

      it("transfers the requested amount", async function () {
        await doTransfer(this.token, from, to, amount, this.forwarder);

        expect(await this.token.balanceOf(from)).to.be.equal("0");
        expect(await this.token.balanceOf(to)).to.be.equal(amount);
      });

      it("emits a transfer event", async function () {
        await expect(doTransfer(this.token, from, to, amount, this.forwarder))
          .to.emit(this.token, "Transfer")
          .withArgs(from, to, amount);
      });
    });

    describe("when the sender transfers zero tokens", function () {
      const amount = BigNumber.from("0");

      it("transfers the requested amount", async function () {
        await doTransfer(this.token, from, to, amount, this.forwarder);

        expect(await this.token.balanceOf(from)).to.be.equal(balance);

        expect(await this.token.balanceOf(to)).to.be.equal(0);
      });

      it("emits a transfer event", async function () {
        await expect(doTransfer(this.token, from, to, amount, this.forwarder))
          .to.emit(this.token, "Transfer")
          .withArgs(from, to, amount);
      });
    });
  });

  describe("when the recipient is the zero address", function () {
    it("reverts", async function () {
      await expect(
        doTransfer(
          this.token,
          from,
          ethers.constants.AddressZero,
          balance,
          this.forwarder
        )
      ).to.be.revertedWith("ERC20: transfer to the zero address");
    });
  });
}

export function shouldBehaveLikeERC20TransferFrom(
  spender: Address,
  tokenOwner: Address | string,
  to: Address,
  balance: BigNumber,
  doTransferFrom: (
    token: Contract,
    spender: Address | string,
    tokenOwner: Address | string,
    to: Address | string,
    amount: BigNumber,
    forwarder: Contract | null
  ) => Promise<any>
) {
  describe("when the token owner is not the zero address", function () {
    describe("when the recipient is not the zero address", function () {
      describe("when the spender has enough allowance", function () {
        beforeEach(async function () {
          await this.token.connect(tokenOwner).approve(spender, balance);
        });

        describe("when the token owner has enough balance", function () {
          const amount = balance;

          it("transfers the requested amount", async function () {
            await doTransferFrom(
              this.token,
              spender,
              tokenOwner,
              to,
              amount,
              this.forwarder
            );

            expect(await this.token.balanceOf(tokenOwner)).to.be.equal(0);

            expect(await this.token.balanceOf(to)).to.be.equal(amount);
          });

          it("decreases the spender allowance", async function () {
            await doTransferFrom(
              this.token,
              spender,
              tokenOwner,
              to,
              amount,
              this.forwarder
            );

            expect(await this.token.allowance(tokenOwner, spender)).to.be.equal(
              0
            );
          });

          it("emits a transfer event", async function () {
            await expect(
              doTransferFrom(
                this.token,
                spender,
                tokenOwner,
                to,
                amount,
                this.forwarder
              )
            )
              .to.emit(this.token, "Transfer")
              .withArgs(tokenOwner, to, amount);
          });

          it("emits an approval event", async function () {
            await expect(
              await doTransferFrom(
                this.token,
                spender,
                tokenOwner,
                to,
                amount,
                this.forwarder
              )
            )
              .to.emit(this.token, "Approval")
              .withArgs(
                tokenOwner,
                spender,
                await this.token.allowance(tokenOwner, spender)
              );
          });
        });

        describe("when the token owner does not have enough balance", function () {
          const amount = balance;

          beforeEach("reducing balance", async function () {
            await this.token.connect(tokenOwner).transfer(to, 1);
          });

          it("reverts", async function () {
            await expect(
              doTransferFrom(
                this.token,
                spender,
                tokenOwner,
                to,
                amount,
                this.forwarder
              )
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
          });
        });
      });

      describe("when the spender does not have enough allowance", function () {
        const allowance = balance.sub(1);

        beforeEach(async function () {
          await this.token.connect(tokenOwner).approve(spender, allowance);
        });

        describe("when the token owner has enough balance", function () {
          const amount = balance;

          it("reverts", async function () {
            await expect(
              doTransferFrom(
                this.token,
                spender,
                tokenOwner,
                to,
                amount,
                this.forwarder
              )
            ).to.be.revertedWith("ERC20: insufficient allowance");
          });
        });

        describe("when the token owner does not have enough balance", function () {
          const amount = allowance;

          beforeEach("reducing balance", async function () {
            await this.token.connect(tokenOwner).transfer(to, 2);
          });

          it("reverts", async function () {
            await expect(
              doTransferFrom(
                this.token,
                spender,
                tokenOwner,
                to,
                amount,
                this.forwarder
              )
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
          });
        });
      });

      describe("when the spender has unlimited allowance", function () {
        beforeEach(async function () {
          await this.token
            .connect(tokenOwner)
            .approve(spender, ethers.constants.MaxUint256);
        });

        it("does not decrease the spender allowance", async function () {
          await doTransferFrom(
            this.token,
            spender,
            tokenOwner,
            to,
            BigNumber.from(1),
            this.forwarder
          );
          expect(await this.token.allowance(tokenOwner, spender)).to.be.equal(
            ethers.constants.MaxUint256
          );
        });

        it("does not emit an approval event", async function () {
          await expect(
            doTransferFrom(
              this.token,
              spender,
              tokenOwner,
              to,
              BigNumber.from(1),
              this.forwarder
            )
          ).to.not.emit(this.token, "Approval");
        });
      });
    });

    describe("when the recipient is the zero address", function () {
      const amount = balance;

      beforeEach(async function () {
        await this.token.connect(tokenOwner).approve(spender, amount);
      });

      it("reverts", async function () {
        await expect(
          doTransferFrom(
            this.token,
            spender,
            tokenOwner,
            ethers.constants.AddressZero,
            amount,
            this.forwarder
          )
        ).to.be.revertedWith("ERC20: transfer to the zero address");
      });
    });
  });

  describe("when the token owner is the zero address", function () {
    it("reverts", async function () {
      await expect(
        doTransferFrom(
          this.token,
          spender,
          ethers.constants.AddressZero,
          to,
          BigNumber.from(0),
          this.forwarder
        )
      ).to.be.revertedWith("from the zero address");
    });
  });
}

export function shouldBehaveLikeERC20Approve(
  owner: Address,
  spender: Address,
  supply: BigNumber,
  doApprove: (
    token: Contract,
    owner: Address | string,
    spender: Address | string,
    amount: BigNumber,
    forwarder: Contract | null
  ) => Promise<any>
) {
  describe("when the spender is not the zero address", function () {
    describe("when the sender has enough balance", function () {
      const amount = supply;

      it("emits an approval event", async function () {
        await expect(
          doApprove(this.token, owner, spender, amount, this.forwarder)
        )
          .to.emit(this.token, "Approval")
          .withArgs(owner, spender, amount);
      });

      describe("when there was no approved amount before", function () {
        it("approves the requested amount", async function () {
          await doApprove(this.token, owner, spender, amount, this.forwarder);

          expect(await this.token.allowance(owner, spender)).to.be.equal(
            amount
          );
        });
      });

      describe("when the spender had an approved amount", function () {
        beforeEach(async function () {
          await doApprove(
            this.token,
            owner,
            spender,
            BigNumber.from(1),
            this.forwarder
          );
        });

        it("approves the requested amount and replaces the previous one", async function () {
          await doApprove(this.token, owner, spender, amount, this.forwarder);

          expect(await this.token.allowance(owner, spender)).to.be.equal(
            amount
          );
        });
      });
    });

    describe("when the sender does not have enough balance", function () {
      const amount = supply.add(1);

      it("emits an approval event", async function () {
        await expect(
          doApprove(this.token, owner, spender, amount, this.forwarder)
        )
          .to.emit(this.token, "Approval")
          .withArgs(owner, spender, amount);
      });

      describe("when there was no approved amount before", function () {
        it("approves the requested amount", async function () {
          await doApprove(this.token, owner, spender, amount, this.forwarder);

          expect(await this.token.allowance(owner, spender)).to.be.equal(
            amount
          );
        });
      });

      describe("when the spender had an approved amount", function () {
        beforeEach(async function () {
          await doApprove(
            this.token,
            owner,
            spender,
            BigNumber.from(1),
            this.forwarder
          );
        });

        it("approves the requested amount and replaces the previous one", async function () {
          await doApprove(this.token, owner, spender, amount, this.forwarder);

          expect(await this.token.allowance(owner, spender)).to.be.equal(
            amount
          );
        });
      });
    });
  });

  describe("when the spender is the zero address", function () {
    it("reverts", async function () {
      await expect(
        doApprove(
          this.token,
          owner,
          ethers.constants.AddressZero,
          supply,
          this.forwarder
        )
      ).to.be.revertedWith("ERC20: approve to the zero address");
    });
  });
}
