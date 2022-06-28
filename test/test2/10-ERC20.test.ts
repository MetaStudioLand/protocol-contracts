import {expect} from "chai";
import {BigNumber} from "ethers";
import {ethers, tracer, upgrades} from "hardhat";
import {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Approve,
  shouldBehaveLikeERC20Transfer,
} from "./ERC20.behavior";

describe("ERC20", async function () {
  const name = "MetaStudioToken";
  const symbol = "SMV";
  const decimals = 18;

  /*
    Affecting accounts
   */
  const accounts = await ethers.getSigners();

  const owner = accounts[0];
  tracer.nameTags[owner.address] = "contractOwner";
  const initialHolder = accounts[1];
  tracer.nameTags[initialHolder.address] = "initialHolder";
  const recipient = accounts[2];
  tracer.nameTags[recipient.address] = "recipient";
  const anotherAccount = accounts[3];
  tracer.nameTags[anotherAccount.address] = "anotherAccount";

  const tokens = function (amount: number): BigNumber {
    return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
  };

  const initialSupply = tokens(5_000_000_000);

  describe("======== Contract: ERC20 ========", async function () {
    beforeEach(async function () {
      const Factory = await ethers.getContractFactory("MetaStudioToken");
      const proxyContract = await upgrades.deployProxy(
        Factory,
        [initialHolder.address, ethers.constants.AddressZero],
        {kind: "uups"}
      );
      await proxyContract.deployed();
      this.token = proxyContract;

      console.log(
        `--1-> initialHolder balance: ${await this.token.balanceOf(
          initialHolder.address
        )}`
      );
    });

    it(`has a name: "${name}"`, async function () {
      expect(await this.token.name()).to.equal(name);
    });

    it(`has a symbol: "${symbol}"`, async function () {
      expect(await this.token.symbol()).to.equal(symbol);
    });

    it(`has ${decimals} decimals`, async function () {
      expect(await this.token.decimals()).to.be.equal(decimals);
    });

    await shouldBehaveLikeERC20(
      initialSupply,
      initialHolder,
      recipient,
      anotherAccount
    );

    describe("decrease allowance", function () {
      describe("when the spender is not the zero address", function () {
        const spender = recipient;

        const shouldDecreaseApproval = function (amount: BigNumber) {
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
                .withArgs(
                  initialHolder.address,
                  spender.address,
                  BigNumber.from(0)
                );
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
                .approve(spender.address, BigNumber.from(1));
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
                .approve(spender.address, BigNumber.from(1));
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
        const spender = ethers.constants.AddressZero;

        it("reverts", async function () {
          await expect(
            this.token.connect(initialHolder).increaseAllowance(spender, amount)
          ).to.be.revertedWith("ERC20: approve to the zero address");
        });
      });
    });

    describe("_transfer", function () {
      shouldBehaveLikeERC20Transfer(
        initialHolder,
        recipient,
        initialSupply,
        true
      );

      describe("when the sender is the zero address", function () {
        it("reverts", async function () {
          await expect(
            this.token.transferInternal(
              ethers.constants.AddressZero,
              recipient,
              initialSupply
            )
          ).to.be.revertedWith("ERC20: transfer from the zero address");
        });
      });
    });

    describe("_approve", async function () {
      await shouldBehaveLikeERC20Approve(
        initialHolder,
        recipient,
        initialSupply,
        true
      );

      describe("when the owner is the zero address", function () {
        it("reverts", async function () {
          await expect(
            this.token.approveInternal(
              ethers.constants.AddressZero,
              recipient,
              initialSupply
            )
          ).to.be.revertedWith("ERC20: approve from the zero address");
        });
      });
    });
  });
});
