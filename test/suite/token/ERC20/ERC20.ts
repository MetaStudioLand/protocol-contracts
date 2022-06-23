import {expect} from "chai";
import {BigNumber, Contract} from "ethers";
import {tracer} from "hardhat";
import {toBN, ZERO_ADDRESS} from "../../helpers";
import {ISuiteOptions} from "../../suite";
import {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Approve,
  shouldBehaveLikeERC20Transfer,
} from "./ERC20.behavior";

export class ERC20 {
  token: Contract | undefined;

  async run(options: ISuiteOptions) {
    /*
      Affecting accounts
     */
    const contractOwner = options.accounts[0];
    tracer.nameTags[contractOwner.address] = "contractOwner";
    const initialHolder =
      options.accounts[
        options.tokensOwnerAccountIdx ? options.tokensOwnerAccountIdx : 0
      ];
    tracer.nameTags[initialHolder.address] = "initialHolder";

    const firstUserAccountIdx =
      options.firstUserAccountIdx ?? (options.tokensOwnerAccountIdx ?? 0) + 1;

    const recipient = options.accounts[firstUserAccountIdx];
    tracer.nameTags[recipient.address] = "recipient";
    const anotherAccount = options.accounts[firstUserAccountIdx + 1];
    tracer.nameTags[anotherAccount.address] = "anotherAccount";
    const charles = options.accounts[firstUserAccountIdx + 2];
    tracer.nameTags[charles.address] = "charles";

    const tokens = function (amount: number): BigNumber {
      return toBN(amount).mul(toBN(10).pow(options.decimals));
    };

    const initialSupply = tokens(options.initialSupply);
    const errorPrefix = options.ercs.erc20?.errorPrefix ?? "ERC20";

    beforeEach(async function () {
      this.token = await options.create(options);
      if (options.beforeEach) {
        await options.beforeEach(this.token, options);
      }
    });

    it("has a name", async function () {
      expect(await this.token.name()).to.equal(options.name);
    });

    it("has a symbol", async function () {
      expect(await this.token.symbol()).to.equal(options.symbol);
    });

    it("has 18 decimals", async function () {
      expect(await this.token.decimals()).to.be.equal(options.decimals);
    });

    // describe("set decimals", function () {
    //   const decimals = new BN(6);
    //
    //   it("can set decimals during construction", async function () {
    //     const token = await ERC20DecimalsMock.new(name, symbol, decimals);
    //     expect(await token.decimals()).to.be.bignumber.equal(decimals);
    //   });
    // });

    await shouldBehaveLikeERC20(
      errorPrefix,
      initialSupply,
      initialHolder,
      recipient,
      anotherAccount
    );

    describe("decrease allowance", function () {
      describe("when the spender is not the zero address", function () {
        const spender = recipient;

        function shouldDecreaseApproval(amount: BigNumber) {
          describe("when there was no approved amount before", function () {
            it("reverts", async function () {
              await expect(
                this.token
                  .connect(initialHolder)
                  .decreaseAllowance(spender.address, amount)
              ).to.be.revertedWith("ERC20: decreased allowance below zero");
            });
          });

          describe("when the spender had an approved amount", function () {
            const approvedAmount = amount;

            beforeEach(async function () {
              await this.token
                .connect(initialHolder)
                .approve(spender.address, approvedAmount);
            });

            it("emits an approval event", async function () {
              await expect(
                this.token
                  .connect(initialHolder)
                  .decreaseAllowance(spender.address, approvedAmount)
              )
                .to.emit(this.token, "Approval")
                .withArgs(initialHolder.address, spender.address, toBN(0));
            });

            it("decreases the spender allowance subtracting the requested amount", async function () {
              await this.token
                .connect(initialHolder)
                .decreaseAllowance(spender.address, approvedAmount.sub(1));

              expect(
                await this.token.allowance(
                  initialHolder.address,
                  spender.address
                )
              ).to.be.equal(1);
            });

            it("sets the allowance to zero when all allowance is removed", async function () {
              await this.token
                .connect(initialHolder)
                .decreaseAllowance(spender.address, approvedAmount);
              expect(
                await this.token.allowance(
                  initialHolder.address,
                  spender.address
                )
              ).to.be.equal(0);
            });

            it("reverts when more than the full allowance is removed", async function () {
              await expect(
                this.token
                  .connect(initialHolder)
                  .decreaseAllowance(spender.address, approvedAmount.add(1))
              ).to.be.revertedWith("ERC20: decreased allowance below zero");
            });
          });
        }

        describe("when the sender has enough balance", function () {
          const amount = initialSupply;

          shouldDecreaseApproval(amount);
        });

        describe("when the sender does not have enough balance", function () {
          const amount = initialSupply.add(1);

          shouldDecreaseApproval(amount);
        });
      });

      describe("when the spender is the zero address", function () {
        const amount = initialSupply;
        const spender = ZERO_ADDRESS;

        it("reverts", async function () {
          await expect(
            this.token.connect(initialHolder).decreaseAllowance(spender, amount)
          ).to.be.revertedWith("ERC20: decreased allowance below zero");
        });
      });
    });

    describe("increase allowance", function () {
      const amount = initialSupply;
      describe("when the spender is not the zero address", function () {
        const spender = recipient;

        describe("when the sender has enough balance", function () {
          it("emits an approval event", async function () {
            // expectEvent(
            //   await this.token.increaseAllowance(spender, amount, {
            //     from: initialHolder,
            //   }),
            //   "Approval",
            //   {owner: initialHolder, spender: spender, value: amount}
            // );
            await expect(
              await this.token
                .connect(initialHolder)
                .increaseAllowance(spender.address, amount)
            )
              .to.emit(this.token, "Approval")
              .withArgs(initialHolder.address, spender.address, amount);
          });

          describe("when there was no approved amount before", function () {
            it("approves the requested amount", async function () {
              await this.token
                .connect(initialHolder)
                .increaseAllowance(spender.address, amount);

              expect(
                await this.token.allowance(
                  initialHolder.address,
                  spender.address
                )
              ).to.be.equal(amount);
            });
          });

          describe("when the spender had an approved amount", function () {
            beforeEach(async function () {
              await this.token
                .connect(initialHolder)
                .approve(spender.address, toBN(1));
            });

            it("increases the spender allowance adding the requested amount", async function () {
              await this.token
                .connect(initialHolder)
                .increaseAllowance(spender.address, amount);

              expect(
                await this.token.allowance(
                  initialHolder.address,
                  spender.address
                )
              ).to.be.equal(amount.add(1));
            });
          });
        });

        describe("when the sender does not have enough balance", function () {
          const amount = initialSupply.add(1);

          it("emits an approval event", async function () {
            // expectEvent(
            //   await this.token.increaseAllowance(spender, amount, {
            //     from: initialHolder,
            //   }),
            //   "Approval",
            //   {owner: initialHolder, spender: spender, value: amount}
            // );
            await expect(
              this.token
                .connect(initialHolder)
                .increaseAllowance(spender.address, amount)
            )
              .to.emit(this.token, "Approval")
              .withArgs(initialHolder.address, spender.address, amount);
          });

          describe("when there was no approved amount before", function () {
            it("approves the requested amount", async function () {
              await this.token
                .connect(initialHolder)
                .increaseAllowance(spender.address, amount);

              expect(
                await this.token.allowance(
                  initialHolder.address,
                  spender.address
                )
              ).to.be.equal(amount);
            });
          });

          describe("when the spender had an approved amount", function () {
            beforeEach(async function () {
              await this.token
                .connect(initialHolder)
                .approve(spender.address, toBN(1));
            });

            it("increases the spender allowance adding the requested amount", async function () {
              await this.token
                .connect(initialHolder)
                .increaseAllowance(spender.address, amount);

              expect(
                await this.token.allowance(
                  initialHolder.address,
                  spender.address
                )
              ).to.be.equal(amount.add(1));
            });
          });
        });
      });

      describe("when the spender is the zero address", function () {
        const spender = ZERO_ADDRESS;

        it("reverts", async function () {
          // await expectRevert(
          //   this.token.increaseAllowance(spender, amount, {
          //     from: initialHolder,
          //   }),
          //   "ERC20: approve to the zero address"
          // );
          await expect(
            this.token.connect(initialHolder).increaseAllowance(spender, amount)
          ).to.be.revertedWith(`${errorPrefix}: approve to the zero address`);
        });
      });
    });

    // TODO reactivate for general usage
    // describe("_mint", function () {
    //   const amount = toBN(50);
    //
    //   it("rejects a null account", async function () {
    //     await expect(this.token.mint(ZERO_ADDRESS, amount)).to.be.revertedWith(
    //       "ERC20: mint to the zero address"
    //     );
    //   });
    //
    //   describe("for a non zero account", function () {
    //     beforeEach("minting", async function () {
    //       this.receipt = await this.token.mint(recipient.address, amount);
    //     });
    //
    //     it("increments totalSupply", async function () {
    //       const expectedSupply = initialSupply.add(amount);
    //       expect(await this.token.totalSupply()).to.be.equal(expectedSupply);
    //     });
    //
    //     it("increments recipient balance", async function () {
    //       expect(await this.token.balanceOf(recipient.address)).to.be.equal(
    //         amount
    //       );
    //     });
    //
    //     it("emits Transfer event", async function () {
    //       // const event = expectEvent(this.receipt, "Transfer", {
    //       //   from: ZERO_ADDRESS,
    //       //   to: recipient,
    //       // });
    //       // expect(event.args.value).to.be.bignumber.equal(amount);
    //       await expect(this.receipt)
    //         .to.emit(this.token, "Transfer")
    //         .withArgs(ZERO_ADDRESS, recipient.address, amount);
    //     });
    //   });
    // });

    // TODO reactivate for general usage
    describe("_burn", function () {
      it("rejects a null account", async function () {
        await expect(this.token.burn(ZERO_ADDRESS, toBN(1))).to.be.revertedWith(
          `${errorPrefix}: burn from the zero address`
        );
      });

      describe("for a non zero account", function () {
        it("rejects burning more than balance", async function () {
          await expect(
            this.token.burn(initialHolder.address, initialSupply.add(1))
          ).to.be.revertedWith(`${errorPrefix}: burn amount exceeds balance`);
        });

        const describeBurn = function (description: string, amount: BigNumber) {
          describe(description, function () {
            beforeEach("burning", async function () {
              this.receipt = await this.token.burn(
                initialHolder.address,
                amount
              );
            });

            it("decrements totalSupply", async function () {
              const expectedSupply = initialSupply.sub(amount);
              expect(await this.token.totalSupply()).to.be.equal(
                expectedSupply
              );
            });

            it("decrements initialHolder balance", async function () {
              const expectedBalance = initialSupply.sub(amount);
              expect(
                await this.token.balanceOf(initialHolder.address)
              ).to.be.equal(expectedBalance);
            });

            it("emits Transfer event", async function () {
              // const event = expectEvent(this.receipt, "Transfer", {
              //   from: initialHolder,
              //   to: ZERO_ADDRESS,
              // });
              // expect(event.args.value).to.be.bignumber.equal(amount);
              await expect(this.receipt)
                .to.emit(this.token, "Transfer")
                .withArgs(initialHolder.address, ZERO_ADDRESS, amount);
            });
          });
        };

        describeBurn("for entire balance", initialSupply);
        describeBurn("for less amount than balance", initialSupply.sub(1));
      });
    });

    describe("_transfer", function () {
      shouldBehaveLikeERC20Transfer(
        errorPrefix,
        initialHolder,
        recipient,
        initialSupply,
        true
      );

      describe("when the sender is the zero address", function () {
        it("reverts", async function () {
          await expect(
            this.token.transferInternal(ZERO_ADDRESS, recipient, initialSupply)
          ).to.be.revertedWith("ERC20: transfer from the zero address");
        });
      });
    });

    describe("_approve", function () {
      shouldBehaveLikeERC20Approve(
        "ERC20",
        initialHolder,
        recipient,
        initialSupply,
        true
      );

      describe("when the owner is the zero address", function () {
        it("reverts", async function () {
          await expect(
            this.token.approveInternal(ZERO_ADDRESS, recipient, initialSupply)
          ).to.be.revertedWith("ERC20: approve from the zero address");
        });
      });
    });
  }
}
