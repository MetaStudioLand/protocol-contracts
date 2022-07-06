import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber, Contract} from "ethers";
import {ethers} from "hardhat";
import {getAddress} from "../../../shared/utils";

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
    shouldBehaveLikeERC20Transfer(
      initialHolder,
      recipient,
      initialSupply,
      function (
        token: Contract,
        from: SignerWithAddress | string,
        to: SignerWithAddress | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        return token.connect(from).transfer(getAddress(to), amount);
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
        spender: SignerWithAddress | string,
        tokenOwner: SignerWithAddress | string,
        to: SignerWithAddress | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        return token
          .connect(spender)
          .transferFrom(getAddress(tokenOwner), getAddress(to), amount);
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
        owner: SignerWithAddress | string,
        spender: SignerWithAddress | string,
        amount: BigNumber,
        forwarder: Contract | null
      ) {
        return token.connect(owner).approve(getAddress(spender), amount);
      }
    );
  });
}

export function shouldBehaveLikeERC20Transfer(
  from: SignerWithAddress,
  to: SignerWithAddress,
  balance: BigNumber,
  doTransfer: (
    token: Contract,
    from: SignerWithAddress | string,
    to: SignerWithAddress | string,
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

        expect(await this.token.balanceOf(from.address)).to.be.equal("0");
        expect(await this.token.balanceOf(to.address)).to.be.equal(amount);
      });

      it("emits a transfer event", async function () {
        await expect(doTransfer(this.token, from, to, amount, this.forwarder))
          .to.emit(this.token, "Transfer")
          .withArgs(from.address, to.address, amount);
      });
    });

    describe("when the sender transfers zero tokens", function () {
      const amount = BigNumber.from("0");

      it("transfers the requested amount", async function () {
        await doTransfer(this.token, from, to, amount, this.forwarder);

        expect(await this.token.balanceOf(from.address)).to.be.equal(balance);

        expect(await this.token.balanceOf(to.address)).to.be.equal(0);
      });

      it("emits a transfer event", async function () {
        await expect(doTransfer(this.token, from, to, amount, this.forwarder))
          .to.emit(this.token, "Transfer")
          .withArgs(from.address, to.address, amount);
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
  spender: SignerWithAddress,
  tokenOwner: SignerWithAddress | string,
  to: SignerWithAddress,
  balance: BigNumber,
  doTransferFrom: (
    token: Contract,
    spender: SignerWithAddress | string,
    tokenOwner: SignerWithAddress | string,
    to: SignerWithAddress | string,
    amount: BigNumber,
    forwarder: Contract | null
  ) => Promise<any>
) {
  describe("when the token owner is not the zero address", function () {
    describe("when the recipient is not the zero address", function () {
      describe("when the spender has enough allowance", function () {
        beforeEach(async function () {
          await this.token
            .connect(tokenOwner)
            .approve(getAddress(spender), balance);
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

            expect(
              await this.token.balanceOf(getAddress(tokenOwner))
            ).to.be.equal(0);

            expect(await this.token.balanceOf(getAddress(to))).to.be.equal(
              amount
            );
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

            expect(
              await this.token.allowance(
                getAddress(tokenOwner),
                getAddress(spender)
              )
            ).to.be.equal(0);
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
              .withArgs(getAddress(tokenOwner), getAddress(to), amount);
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
                getAddress(tokenOwner),
                getAddress(spender),
                await this.token.allowance(
                  getAddress(tokenOwner),
                  getAddress(spender)
                )
              );
          });
        });

        describe("when the token owner does not have enough balance", function () {
          const amount = balance;

          beforeEach("reducing balance", async function () {
            await this.token.connect(tokenOwner).transfer(getAddress(to), 1);
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
          await this.token
            .connect(tokenOwner)
            .approve(getAddress(spender), allowance);
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
            await this.token.connect(tokenOwner).transfer(getAddress(to), 2);
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
            .approve(spender.address, ethers.constants.MaxUint256);
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
          expect(
            await this.token.allowance(
              getAddress(tokenOwner),
              getAddress(spender)
            )
          ).to.be.equal(ethers.constants.MaxUint256);
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
        await this.token.connect(tokenOwner).approve(spender.address, amount);
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
  owner: SignerWithAddress,
  spender: SignerWithAddress,
  supply: BigNumber,
  doApprove: (
    token: Contract,
    owner: SignerWithAddress | string,
    spender: SignerWithAddress | string,
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
          .withArgs(owner.address, spender.address, amount);
      });

      describe("when there was no approved amount before", function () {
        it("approves the requested amount", async function () {
          await doApprove(this.token, owner, spender, amount, this.forwarder);

          expect(
            await this.token.allowance(owner.address, spender.address)
          ).to.be.equal(amount);
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

          expect(
            await this.token.allowance(owner.address, spender.address)
          ).to.be.equal(amount);
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
          .withArgs(owner.address, spender.address, amount);
      });

      describe("when there was no approved amount before", function () {
        it("approves the requested amount", async function () {
          await doApprove(this.token, owner, spender, amount, this.forwarder);

          expect(
            await this.token.allowance(owner.address, spender.address)
          ).to.be.equal(amount);
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
