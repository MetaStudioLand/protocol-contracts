import {expect} from "chai";
import {BigNumber} from "ethers";
import {ethers} from "hardhat";
import {NB_DECIMALS} from "../shared/constants";
import {getSuiteContext, tokens} from "../shared/utils";
import {shouldBehaveLikeERC20} from "./behaviors/ERC20.behavior";

export function unitTestERC20(): void {
  describe("======== Contract: ERC20 ========", async function () {
    const name = "MetaStudioToken";
    const symbol = "SMV";
    const initialSupply = tokens(5_000_000_000);

    it(`has a name: "${name}"`, async function () {
      expect(await this.token.name()).to.equal(name);
    });

    it(`has a symbol: "${symbol}"`, async function () {
      expect(await this.token.symbol()).to.equal(symbol);
    });

    it(`has ${NB_DECIMALS} decimals`, async function () {
      expect(await this.token.decimals()).to.be.equal(NB_DECIMALS);
    });

    const {signers} = getSuiteContext(this);
    shouldBehaveLikeERC20(
      initialSupply,
      signers.initialHolder,
      signers.recipient,
      signers.anotherAccount
    );

    describe("decrease allowance", function () {
      describe("when the spender is not the zero address", function () {
        const shouldDecreaseApproval = function (amount: BigNumber) {
          describe("when there was no approved amount before", function () {
            it("reverts", async function () {
              await expect(
                this.token
                  .connect(this.signers.initialHolder)
                  .decreaseAllowance(this.signers.spender.address, amount)
              ).to.be.revertedWith("ERC20: decreased allowance below zero");
            });
          });

          describe("when the spender had an approved amount", function () {
            const approvedAmount = amount;

            beforeEach(async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .approve(this.signers.spender.address, approvedAmount);
            });

            it("emits an approval event", async function () {
              await expect(
                this.token
                  .connect(this.signers.initialHolder)
                  .decreaseAllowance(
                    this.signers.spender.address,
                    approvedAmount
                  )
              )
                .to.emit(this.token, "Approval")
                .withArgs(
                  this.signers.initialHolder.address,
                  this.signers.spender.address,
                  BigNumber.from(0)
                );
            });

            it("decreases the spender allowance subtracting the requested amount", async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .decreaseAllowance(
                  this.signers.spender.address,
                  approvedAmount.sub(1)
                );

              expect(
                await this.token.allowance(
                  this.signers.initialHolder.address,
                  this.signers.spender.address
                )
              ).to.be.equal(1);
            });

            it("sets the allowance to zero when all allowance is removed", async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .decreaseAllowance(
                  this.signers.spender.address,
                  approvedAmount
                );
              expect(
                await this.token.allowance(
                  this.signers.initialHolder.address,
                  this.signers.spender.address
                )
              ).to.be.equal(0);
            });

            it("reverts when more than the full allowance is removed", async function () {
              await expect(
                this.token
                  .connect(this.signers.initialHolder)
                  .decreaseAllowance(
                    this.signers.spender.address,
                    approvedAmount.add(1)
                  )
              ).to.be.revertedWith("ERC20: decreased allowance below zero");
            });
          });
        };

        describe("when the sender has enough balance", function () {
          shouldDecreaseApproval(initialSupply);
        });

        describe("when the sender does not have enough balance", function () {
          const amount = initialSupply.add(1);
          shouldDecreaseApproval(amount);
        });
      });

      describe("when the spender is the zero address", function () {
        const amount = initialSupply;
        const spender = ethers.constants.AddressZero;

        it("reverts", async function () {
          await expect(
            this.token
              .connect(this.signers.initialHolder)
              .decreaseAllowance(spender, amount)
          ).to.be.revertedWith("ERC20: decreased allowance below zero");
        });
      });
    });

    describe("increase allowance", function () {
      const amount = initialSupply;
      describe("when the spender is not the zero address", function () {
        describe("when the sender has enough balance", function () {
          it("emits an approval event", async function () {
            await expect(
              await this.token
                .connect(this.signers.initialHolder)
                .increaseAllowance(this.signers.spender.address, amount)
            )
              .to.emit(this.token, "Approval")
              .withArgs(
                this.signers.initialHolder.address,
                this.signers.spender.address,
                amount
              );
          });

          describe("when there was no approved amount before", function () {
            it("approves the requested amount", async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .increaseAllowance(this.signers.spender.address, amount);

              expect(
                await this.token.allowance(
                  this.signers.initialHolder.address,
                  this.signers.spender.address
                )
              ).to.be.equal(amount);
            });
          });

          describe("when the spender had an approved amount", function () {
            beforeEach(async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .approve(this.signers.spender.address, BigNumber.from(1));
            });

            it("increases the spender allowance adding the requested amount", async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .increaseAllowance(this.signers.spender.address, amount);

              expect(
                await this.token.allowance(
                  this.signers.initialHolder.address,
                  this.signers.spender.address
                )
              ).to.be.equal(amount.add(1));
            });
          });
        });

        describe("when the sender does not have enough balance", function () {
          const amount = initialSupply.add(1);

          it("emits an approval event", async function () {
            await expect(
              this.token
                .connect(this.signers.initialHolder)
                .increaseAllowance(this.signers.spender.address, amount)
            )
              .to.emit(this.token, "Approval")
              .withArgs(
                this.signers.initialHolder.address,
                this.signers.spender.address,
                amount
              );
          });

          describe("when there was no approved amount before", function () {
            it("approves the requested amount", async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .increaseAllowance(this.signers.spender.address, amount);

              expect(
                await this.token.allowance(
                  this.signers.initialHolder.address,
                  this.signers.spender.address
                )
              ).to.be.equal(amount);
            });
          });

          describe("when the spender had an approved amount", function () {
            beforeEach(async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .approve(this.signers.spender.address, BigNumber.from(1));
            });

            it("increases the spender allowance adding the requested amount", async function () {
              await this.token
                .connect(this.signers.initialHolder)
                .increaseAllowance(this.signers.spender.address, amount);

              expect(
                await this.token.allowance(
                  this.signers.initialHolder.address,
                  this.signers.spender.address
                )
              ).to.be.equal(amount.add(1));
            });
          });
        });
      });

      describe("when the spender is the zero address", function () {
        const spender = ethers.constants.AddressZero;

        it("reverts", async function () {
          await expect(
            this.token
              .connect(this.signers.initialHolder)
              .increaseAllowance(spender, amount)
          ).to.be.revertedWith("ERC20: approve to the zero address");
        });
      });
    });
  });
}
