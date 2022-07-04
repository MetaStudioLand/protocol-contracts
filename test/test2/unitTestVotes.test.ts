import {expect} from "chai";
import {BigNumber, Wallet} from "ethers";
import {batchInBlock, MAX_UINT256, ZERO_ADDRESS} from "../shared/constants";
import {tokens} from "../shared/utils";
import {domainSeparator} from "./helper";
import {ethers} from "hardhat";
import { splitSignature } from "ethers/lib/utils";
import { datanew } from "../helpers/eip712";
export function unitTestVotes() {
  describe("======== ERC20 VOTES ================================================", async function () {
    const name = "MetaStudioToken";
    const initialSupply = tokens(5_000_000_000);
    const version = "1";
    it("initial nonce is 0", async function () {
      expect(
        await this.token.nonces(this.signers.initialHolder.address)
      ).to.be.equal(BigNumber.from(0));
    });

    it("domain separator", async function () {
      expect(await this.token.DOMAIN_SEPARATOR()).to.equal(
        await domainSeparator(name, version, this.chainId, this.token.address)
      );
    });

    it("minting restriction", async function () {
      const amount = BigNumber.from(2).pow(BigNumber.from(244));
      expect(
        this.token.transfer(this.signers.initialHolder.address, amount)
      ).to.be.revertedWith("ERC20Votes: total supply risks overflowing votes");
    });

    describe("set delegation", function () {
      describe("call", function () {
        it("delegation with balance", async function () {
          expect(
            await this.token.delegates(this.signers.initialHolder.address)
          ).to.be.equal(ZERO_ADDRESS);

          const receipt = await this.token
            .connect(this.signers.initialHolder)
            .delegate(this.signers.initialHolder.address);

          expect(receipt)
            .to.emit(this.token, "DelegateChanged")
            .withArgs(
              this.signers.initialHolder.address,
              ZERO_ADDRESS,
              this.signers.initialHolder.address
            );
          expect(receipt)
            .to.emit(this.token, "DelegateVotesChanged")
            .withArgs(
              this.signers.initialHolder.address,
              BigNumber.from(0),
              this.initialSupply
            );
          expect(
            await this.token.delegates(this.signers.initialHolder.address)
          ).to.be.equal(this.signers.initialHolder.address);
          expect(
            await this.token.getVotes(this.signers.initialHolder.address)
          ).to.be.equal(this.initialSupply);
          expect(
            await this.token.getPastVotes(
              this.signers.initialHolder.address,
              receipt.blockNumber - 1
            )
          ).to.be.equal(BigNumber.from(0));
          const sevenDays = 7 * 24 * 60 * 60;
          const blockNumBefore = await ethers.provider.getBlockNumber();
          const blockBefore = await ethers.provider.getBlock(blockNumBefore);
          const timestampBefore = blockBefore.timestamp;
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          const blockNumAfter = await ethers.provider.getBlockNumber();
          const blockAfter = await ethers.provider.getBlock(blockNumAfter);
          const timestampAfter = blockAfter.timestamp;
          expect(blockNumAfter).to.be.equal(blockNumBefore + 1);
          expect(timestampAfter).to.be.equal(timestampBefore + sevenDays);
          expect(
            await this.token.getPastVotes(
              this.signers.initialHolder.address,
              receipt.blockNumber
            )
          ).to.be.equal(this.initialSupply);
        });
        it("delegation without balance", async function () {
          expect(
            await this.token.delegates(this.signers.initialHolder.address)
          ).to.be.equal(ZERO_ADDRESS);
          const receipt = await this.token
            .connect(this.signers.initialHolder)
            .delegate(this.signers.initialHolder.address);

          expect(receipt)
            .to.emit(this.token, "DelegateChanged")
            .withArgs(
              this.signers.initialHolder.address,
              ZERO_ADDRESS,
              this.signers.initialHolder.address
            );
          expect(receipt).not.emit(this.token, "DelegateVotesChanged");
          expect(
            await this.token.delegates(this.signers.initialHolder.address)
          ).to.be.equal(this.signers.initialHolder.address);
        });
      });
      describe("with signature", async function () {
        beforeEach(async function () {
          this.randomWallet = Wallet.createRandom();
          this.addrWalet = await this.randomWallet.getAddress();
          this.nonce = BigNumber.from(0);
          this.token.transfer(this.addrWalet, initialSupply);
        });

        it('accept signed delegation', async function () {
         const message ={
            delegatee: this.addrWalet,
            nonce :this.nonce,
            expiry: ethers.constants.MaxUint256._hex,
          }

          const permitData712 = datanew(
            this.name,
            this.chainId,
            this.token,
            message
          );
          const flatSig = await ethers.provider.send("eth_signTypedData_v4", [
            this.signers.initialHolder.address,
            permitData712,
          ]);
          const sig = splitSignature(flatSig);
        // fromRpcSig(ethSigUtil.signTypedData(
        //   this.randomWallet.privateKey,
        // buildData(this.chainId,
        //     this.token.address, {
        //     delegatee: this.addrWalet,
        //     nonce: BigNumber.from(0),
        //     expiry: MAX_UINT256,
        //   }),
        // ));
        expect(await this.token.delegates(this.addrWalet)).to.be.equal(ZERO_ADDRESS);

        const  receipt = await this.token.delegateBySig(this.addrWalet, 0, MAX_UINT256, sig.v, sig.r, sig.s);
        
        expect(receipt)
        .to.emit(this.token, "DelegateChanged")
        .withArgs(
          this.addrWalet,
          ZERO_ADDRESS,
          this.addrWalet
        );

        expect(receipt)
        .to.emit(this.token, "DelegateVotesChanged")
        .withArgs(
          this.addrWalet,
          '0',
          this.initialSupply
        );
        expect(await this.token.delegates(this.addrWalet)).to.be.equal(this.addrWalet);

        expect(await this.token.getVotes(this.addrWalet)).to.be.equal(this.initialSupply);
        expect(await this.token.getPastVotes(this.addrWalet, receipt.blockNumber - 1)).to.be.equal(BigNumber.from(0));
        const sevenDays = 5 * 24 * 60 * 60;
        await ethers.provider.send("evm_increaseTime", [sevenDays]);
        await ethers.provider.send("evm_mine", []);
        expect(await this.token.getPastVotes(this.addrWalet, receipt.blockNumber)).to.be.equal(this.initialSupply);
        });

        // it('rejects reused signature', async function () {
        //   const { v, r, s } = fromRpcSig(ethSigUtil.signTypedMessage(
        //     delegator.getPrivateKey(),
        //     buildData(this.chainId, this.token.address, {
        //       delegatee: delegatorAddress,
        //       nonce,
        //       expiry: MAX_UINT256,
        //     }),
        //   ));

        //   await this.token.delegateBySig(delegatorAddress, nonce, MAX_UINT256, v, r, s);

        //   await expectRevert(
        //     this.token.delegateBySig(delegatorAddress, nonce, MAX_UINT256, v, r, s),
        //     'ERC20Votes: invalid nonce',
        //   );
        // });

        // it('rejects bad delegatee', async function () {
        //   const { v, r, s } = fromRpcSig(ethSigUtil.signTypedMessage(
        //     delegator.getPrivateKey(),
        //     buildData(this.chainId, this.token.address, {
        //       delegatee: delegatorAddress,
        //       nonce,
        //       expiry: MAX_UINT256,
        //     }),
        //   ));

        //   const receipt = await this.token.delegateBySig(holderDelegatee, nonce, MAX_UINT256, v, r, s);
        //   const { args } = receipt.logs.find(({ event }) => event == 'DelegateChanged');
        //   expect(args.delegator).to.not.be.equal(delegatorAddress);
        //   expect(args.fromDelegate).to.be.equal(ZERO_ADDRESS);
        //   expect(args.toDelegate).to.be.equal(holderDelegatee);
        // });

        // it('rejects bad nonce', async function () {
        //   const { v, r, s } = fromRpcSig(ethSigUtil.signTypedMessage(
        //     delegator.getPrivateKey(),
        //     buildData(this.chainId, this.token.address, {
        //       delegatee: delegatorAddress,
        //       nonce,
        //       expiry: MAX_UINT256,
        //     }),
        //   ));
        //   await expectRevert(
        //     this.token.delegateBySig(delegatorAddress, nonce + 1, MAX_UINT256, v, r, s),
        //     'ERC20Votes: invalid nonce',
        //   );
        // });

        // it('rejects expired permit', async function () {
        //   const expiry = (await time.latest()) - time.duration.weeks(1);
        //   const { v, r, s } = fromRpcSig(ethSigUtil.signTypedMessage(
        //     delegator.getPrivateKey(),
        //     buildData(this.chainId, this.token.address, {
        //       delegatee: delegatorAddress,
        //       nonce,
        //       expiry,
        //     }),
        //   ));

        //   await expectRevert(
        //     this.token.delegateBySig(delegatorAddress, nonce, expiry, v, r, s),
        //     'ERC20Votes: signature expired',
        //   );
        // });
      });
    });
    describe("change delegation", function () {
      beforeEach(async function () {
        await this.token
          .connect(this.signers.initialHolder)
          .delegate(this.signers.initialHolder.address);
      });

      it("call", async function () {
        expect(
          await this.token.delegates(this.signers.initialHolder.address)
        ).to.be.equal(this.signers.initialHolder.address);
        const receipt = await this.token
          .connect(this.signers.initialHolder)
          .delegate(this.signers.forwarder.address);
        expect(receipt)
          .to.emit(this.token, "DelegateChanged")
          .withArgs(
            this.signers.initialHolder.address,
            this.signers.initialHolder.address,
            this.signers.forwarder.address
          );
        expect(receipt)
          .to.emit(this.token, "DelegateVotesChanged")
          .withArgs(
            this.signers.initialHolder.address,
            this.initialSupply,
            BigNumber.from(0)
          );

        expect(receipt)
          .to.emit(this.token, "DelegateVotesChanged")
          .withArgs(
            this.signers.forwarder.address,
            BigNumber.from(0),
            this.initialSupply
          );

        expect(
          await this.token.delegates(this.signers.initialHolder.address)
        ).to.be.equal(this.signers.forwarder.address);

        expect(
          await this.token.getVotes(this.signers.initialHolder.address)
        ).to.be.equal(BigNumber.from(0));
        expect(
          await this.token.getVotes(this.signers.forwarder.address)
        ).to.be.equal(this.initialSupply);
        expect(
          await this.token.getPastVotes(
            this.signers.initialHolder.address,
            receipt.blockNumber - 1
          )
        ).to.be.equal(this.initialSupply);
        expect(
          await this.token.getPastVotes(
            this.signers.forwarder.address,
            receipt.blockNumber - 1
          )
        ).to.be.equal(BigNumber.from(0));
        const sevenDays = 5 * 24 * 60 * 60;
        await ethers.provider.send("evm_increaseTime", [sevenDays]);
        await ethers.provider.send("evm_mine", []);

        expect(
          await this.token.getPastVotes(
            this.signers.initialHolder.address,
            receipt.blockNumber
          )
        ).to.be.equal(BigNumber.from(0));
        expect(
          await this.token.getPastVotes(
            this.signers.forwarder.address,
            receipt.blockNumber
          )
        ).to.be.equal(this.initialSupply);
      });
    });

    describe("transfers", function () {
      it("no delegation", async function () {
        const receipt = await this.token
          .connect(this.signers.initialHolder)
          .transfer(this.signers.recipient.address, 1);

        expect(receipt)
          .to.emit(this.token, "Transfer")
          .withArgs(
            this.signers.initialHolder.address,
            this.signers.recipient.address,
            BigNumber.from(1)
          );
        expect(receipt).not.emit(this.token, "DelegateVotesChanged");
        this.holderVotes = BigNumber.from(0);
        this.recipientVotes = BigNumber.from(0);
      });

      it("sender delegation", async function () {
        await this.token
          .connect(this.signers.initialHolder)
          .delegate(this.signers.initialHolder.address);
        const receipt = await this.token
          .connect(this.signers.initialHolder)
          .transfer(this.signers.recipient.address, 1);
        expect(receipt)
          .to.emit(this.token, "Transfer")
          .withArgs(
            this.signers.initialHolder.address,
            this.signers.recipient.address,
            BigNumber.from(1)
          );
        expect(receipt)
          .to.emit(this.token, "DelegateVotesChanged")
          .withArgs(
            this.signers.initialHolder.address,
            this.initialSupply,
            this.initialSupply.sub(1)
          );
        this.holderVotes = this.initialSupply.sub(1);
        this.recipientVotes = BigNumber.from(0);
      });

      it("receiver delegation", async function () {
        await this.token
          .connect(this.signers.recipient)
          .delegate(this.signers.recipient.address);

        const receipt = await this.token
          .connect(this.signers.initialHolder)
          .transfer(this.signers.recipient.address, 1);

        expect(receipt)
          .to.emit(this.token, "Transfer")
          .withArgs(
            this.signers.initialHolder.address,
            this.signers.recipient.address,
            BigNumber.from(1)
          );
        expect(receipt)
          .to.emit(this.token, "DelegateVotesChanged")
          .withArgs(
            this.signers.recipient.address,
            BigNumber.from(0),
            BigNumber.from(1)
          );
        this.holderVotes = BigNumber.from(0);
        this.recipientVotes = BigNumber.from(1);
      });

      it("full delegation", async function () {
        await this.token
          .connect(this.signers.initialHolder)
          .delegate(this.signers.initialHolder.address);
        await this.token
          .connect(this.signers.recipient)
          .delegate(this.signers.recipient.address);
        const receipt = await this.token
          .connect(this.signers.initialHolder)
          .transfer(this.signers.recipient.address, 1);
        expect(receipt)
          .to.emit(this.token, "Transfer")
          .withArgs(
            this.signers.initialHolder.address,
            this.signers.recipient.address,
            BigNumber.from(1)
          );
        expect(receipt)
          .to.emit(this.token, "DelegateVotesChanged")
          .withArgs(
            this.signers.initialHolder.address,
            this.initialSupply,
            this.initialSupply.sub(BigNumber.from(1))
          );
        expect(receipt)
          .to.emit(this.token, "DelegateVotesChanged")
          .withArgs(
            this.signers.recipient.address,
            BigNumber.from(0),
            BigNumber.from(1)
          );
        this.holderVotes = this.initialSupply.sub(BigNumber.from(1));
        this.recipientVotes = BigNumber.from(1);
      });

      afterEach(async function () {
        expect(
          await this.token.getVotes(this.signers.initialHolder.address)
        ).to.be.equal(this.holderVotes);
        expect(
          await this.token.getVotes(this.signers.recipient.address)
        ).to.be.equal(this.recipientVotes);
        const blockNumber = await ethers.provider.getBlockNumber();
        const sevenDays = 7 * 24 * 60 * 60;
        await ethers.provider.send("evm_increaseTime", [sevenDays]);
        await ethers.provider.send("evm_mine", []);
        expect(
          await this.token.getPastVotes(
            this.signers.initialHolder.address,
            blockNumber
          )
        ).to.be.equal(this.holderVotes);
        expect(
          await this.token.getPastVotes(
            this.signers.recipient.address,
            blockNumber
          )
        ).to.be.equal(this.recipientVotes);
      });
    });

    describe("Compound test suite", function () {
      describe("balanceOf", function () {
        it("grants to initial account", async function () {
          expect(
            await this.token.balanceOf(this.signers.initialHolder.address)
          ).to.be.equal(this.initialSupply);
        });
      });

      describe("numCheckpoints", function () {
        it("returns the number of checkpoints for a delegate", async function () {
          await this.token
            .connect(this.signers.initialHolder)
            .transfer(this.signers.recipient.address, BigNumber.from(100)); // give an account a few tokens for readability
          expect(
            await this.token.numCheckpoints(this.signers.anotherAccount.address)
          ).to.be.equal(BigNumber.from(0));

          const t1 = await this.token
            .connect(this.signers.recipient)
            .delegate(this.signers.anotherAccount.address);
          expect(
            await this.token.numCheckpoints(this.signers.anotherAccount.address)
          ).to.be.equal(BigNumber.from(1));

          const t2 = await this.token
            .connect(this.signers.recipient)
            .transfer(this.signers.spender.address, 10);
          expect(
            await this.token.numCheckpoints(this.signers.anotherAccount.address)
          ).to.be.equal(BigNumber.from(2));

          const t3 = await this.token
            .connect(this.signers.recipient)
            .transfer(this.signers.spender.address, 10);
          expect(
            await this.token.numCheckpoints(this.signers.anotherAccount.address)
          ).to.be.equal(BigNumber.from(3));

          const t4 = await this.token
            .connect(this.signers.initialHolder)
            .transfer(this.signers.recipient.address, 20);
          expect(
            await this.token.numCheckpoints(this.signers.anotherAccount.address)
          ).to.be.equal(BigNumber.from(4));

          expect(
            await this.token.checkpoints(
              this.signers.anotherAccount.address,
              BigNumber.from(0)
            )
          ).to.be.deep.equal([t1.blockNumber, BigNumber.from(100)]);
          expect(
            await this.token.checkpoints(
              this.signers.anotherAccount.address,
              BigNumber.from(1)
            )
          ).to.be.deep.equal([t2.blockNumber, BigNumber.from(90)]);
          expect(
            await this.token.checkpoints(
              this.signers.anotherAccount.address,
              BigNumber.from(2)
            )
          ).to.be.deep.equal([t3.blockNumber, BigNumber.from(80)]);
          expect(
            await this.token.checkpoints(
              this.signers.anotherAccount.address,
              BigNumber.from(3)
            )
          ).to.be.deep.equal([t4.blockNumber, BigNumber.from(100)]);
          const sevenDays = 5 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t1.blockNumber
            )
          ).to.be.equal(BigNumber.from(100));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t2.blockNumber
            )
          ).to.be.equal(BigNumber.from(90));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t3.blockNumber
            )
          ).to.be.equal(BigNumber.from(80));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t4.blockNumber
            )
          ).to.be.equal(BigNumber.from(100));
        });

        it("does not add more than one checkpoint in a block", async function () {
          await this.token
            .connect(this.signers.initialHolder)
            .transfer(this.signers.recipient.address, BigNumber.from(100));
          expect(
            await this.token.numCheckpoints(this.signers.anotherAccount.address)
          ).to.be.equal(BigNumber.from(0));

          const [t1] = await batchInBlock([
            () =>
              this.token
                .connect(this.signers.recipient)
                .delegate(this.signers.anotherAccount.address),
            () =>
              this.token
                .connect(this.signers.recipient)
                .transfer(this.signers.spender.address, 10),
            () =>
              this.token
                .connect(this.signers.recipient)
                .transfer(this.signers.spender.address, 10),
          ]);
          expect(
            await this.token.numCheckpoints(this.signers.anotherAccount.address)
          ).to.be.equal(BigNumber.from(1));
          expect(
            await this.token.checkpoints(this.signers.anotherAccount.address, 0)
          ).to.be.deep.equal([t1.blockNumber, BigNumber.from(80)]);

          const t4 = await this.token
            .connect(this.signers.initialHolder)
            .transfer(this.signers.recipient.address, 20);
          expect(
            await this.token.numCheckpoints(this.signers.anotherAccount.address)
          ).to.be.equal(BigNumber.from(2));
          expect(
            await this.token.checkpoints(this.signers.anotherAccount.address, 1)
          ).to.be.deep.equal([t4.blockNumber, BigNumber.from(100)]);
        });
      });

      describe("getPastVotes", function () {
        it("reverts if block number >= current block", async function () {
          expect(
            this.token.getPastVotes(this.signers.anotherAccount.address, 5e10)
          ).to.emit(this.token, "ERC20Votes: block not yet mined");
        });

        it("returns 0 if there are no checkpoints", async function () {
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              0
            )
          ).to.be.equal(BigNumber.from(0));
        });

        it("returns the latest block if >= last checkpoint block", async function () {
          const t1 = await this.token
            .connect(this.signers.initialHolder)
            .delegate(this.signers.anotherAccount.address);
          const sevenDays = 5 * 24 * 60 * 60;

          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);

          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t1.blockNumber
            )
          ).to.be.equal(this.initialSupply);
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t1.blockNumber + 1
            )
          ).to.be.equal(this.initialSupply);
        });

        it("returns zero if < first checkpoint block", async function () {
          const sevenDays = 5 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          const t1 = await this.token
            .connect(this.signers.initialHolder)
            .delegate(this.signers.anotherAccount.address);
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);

          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);

          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t1.blockNumber - 1
            )
          ).to.be.equal(BigNumber.from(0));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t1.blockNumber + 1
            )
          ).to.be.equal(this.initialSupply);
        });

        it("generally returns the voting balance at the appropriate checkpoint", async function () {
          const t1 = await this.token
            .connect(this.signers.initialHolder)
            .delegate(this.signers.anotherAccount.address);
          const sevenDays = 5 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);

          const t2 = await this.token
            .connect(this.signers.initialHolder)
            .transfer(this.signers.spender.address, 10);
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          const t3 = await this.token
            .connect(this.signers.initialHolder)
            .transfer(this.signers.spender.address, 10);
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          const t4 = await this.token
            .connect(this.signers.spender)
            .transfer(this.signers.initialHolder.address, 20);
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);
          await ethers.provider.send("evm_increaseTime", [sevenDays]);
          await ethers.provider.send("evm_mine", []);

          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t1.blockNumber - 1
            )
          ).to.be.equal(BigNumber.from(0));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t1.blockNumber
            )
          ).to.be.equal(this.initialSupply);
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t1.blockNumber + 1
            )
          ).to.be.equal(this.initialSupply);
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t2.blockNumber
            )
          ).to.be.equal(this.initialSupply.sub(10));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t2.blockNumber + 1
            )
          ).to.be.equal(this.initialSupply.sub(10));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t3.blockNumber
            )
          ).to.be.equal(this.initialSupply.sub(20));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t3.blockNumber + 1
            )
          ).to.be.equal(this.initialSupply.sub(20));
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t4.blockNumber
            )
          ).to.be.equal(this.initialSupply);
          expect(
            await this.token.getPastVotes(
              this.signers.anotherAccount.address,
              t4.blockNumber + 1
            )
          ).to.be.equal(this.initialSupply);
        });
      });
    });

    describe("getPastTotalSupply", function () {
      beforeEach(async function () {
        await this.token
          .connect(this.signers.initialHolder)
          .delegate(this.signers.initialHolder.address);
      });

      it("reverts if block number >= current block", async function () {
        expect(this.token.getPastTotalSupply(5e10)).to.emit(
          this.token,
          "ERC20Votes: block not yet mined"
        );
      });

      it("returns 0 if there are no checkpoints", async function () {
        expect(await this.token.getPastTotalSupply(0)).to.be.equal(
          BigNumber.from(0)
        );
      });

      it("returns the latest block if >= last checkpoint block", async function () {
        const t1 = await this.token.transfer(
          this.signers.initialHolder.address,
          BigNumber.from(0)
        );

        const sevenDays = 5 * 24 * 60 * 60;
        await ethers.provider.send("evm_increaseTime", [sevenDays]);
        await ethers.provider.send("evm_mine", []);
        await ethers.provider.send("evm_increaseTime", [sevenDays]);
        await ethers.provider.send("evm_mine", []);

        expect(await this.token.getPastTotalSupply(t1.blockNumber)).to.be.equal(
          this.initialSupply
        );
        expect(
          await this.token.getPastTotalSupply(t1.blockNumber + 1)
        ).to.be.equal(this.initialSupply);
      });

      it("returns zero if < first checkpoint block", async function () {
        const sevenDays = 5 * 24 * 60 * 60;
        await ethers.provider.send("evm_increaseTime", [sevenDays]);
        await ethers.provider.send("evm_mine", []);
        const blockNumBefore = await ethers.provider.getBlockNumber();
        await ethers.provider.send("evm_increaseTime", [sevenDays]);
        await ethers.provider.send("evm_mine", []);
        await ethers.provider.send("evm_increaseTime", [sevenDays]);
        await ethers.provider.send("evm_mine", []);

        expect(
          await this.token.getPastTotalSupply(blockNumBefore - 1)
        ).to.be.equal(this.initialSupply);
        expect(
          await this.token.getPastTotalSupply(blockNumBefore + 1)
        ).to.be.equal(this.initialSupply);
      });
    });
  });
}
