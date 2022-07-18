// import {expect} from "chai";
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signers';
import {expect} from 'chai';
import {BigNumber, Contract} from 'ethers';
import {ethers, tracer} from 'hardhat';
import {Address} from 'hardhat-deploy/dist/types';
import {DATA, RECEIVER_MAGIC_VALUE, SPENDER_MAGIC_VALUE} from '../../shared/constants';
import {getSuiteContext} from '../../shared/utils';

export function unitTestERC1363(): void {
  describe('======== Contract: ERC1363 ================================================', function () {
    const {signers, initialSupply} = getSuiteContext(this);

    describe('via transferFromAndCall', function () {
      beforeEach(async function () {
        await this.token.connect(this.signers.owner).approve(this.signers.spender.address, initialSupply);
      });

      function transferFromAndCallWithData(
        token: Contract,
        from: Address,
        to: Address,
        value: BigNumber,
        opts: SignerWithAddress
      ) {
        return token.connect(opts)['transferFromAndCall(address,address,uint256,bytes)'](from, to, value, DATA);
      }

      function transferFromAndCallWithoutData(token: any, from: any, to: any, value: any, opts: any) {
        return token.connect(opts)['transferFromAndCall(address,address,uint256)'](from, to, value);
      }

      function shouldTransferFromSafely(data: any) {
        describe('to a valid receiver contract', function () {
          beforeEach(async function () {
            const FactoryERC1363Receiver = await ethers.getContractFactory('ERC1363ReceiverMock');
            const contextMockFactoryERC1363Receiver = await FactoryERC1363Receiver.deploy(RECEIVER_MAGIC_VALUE, false);
            await contextMockFactoryERC1363Receiver.deployed();
            this.erc1363Receiver = contextMockFactoryERC1363Receiver;
            tracer.nameTags[this.erc1363Receiver.address] = 'Contract:ERC1363Receiver';
          });

          it('should call onTransferReceived', async function () {
            const tx = await this.token
              .connect(this.signers.initialHolder)
              .increaseAllowance(this.signers.spender.address, initialSupply);
            await tx.wait();
            const receipt =
              data != null
                ? this.token
                    .connect(this.signers.spender)
                    ['transferFromAndCall(address,address,uint256,bytes)'](
                      this.signers.initialHolder.address,
                      this.erc1363Receiver.address,
                      initialSupply,
                      DATA
                    )
                : this.token
                    .connect(this.signers.spender)
                    ['transferFromAndCall(address,address,uint256)'](
                      this.signers.initialHolder.address,
                      this.erc1363Receiver.address,
                      initialSupply
                    );
            expect(receipt)
              .to.emit(this.erc1363Receiver, 'Received')
              .withArgs(
                this.signers.spender.address,
                this.signers.initialHolder.address,
                initialSupply,
                data,
                1_000_000_000
              );
          });
        });
      }

      function transferFromWasSuccessful(sender: SignerWithAddress, spender: SignerWithAddress, balance: BigNumber) {
        beforeEach(async function () {
          const FactoryERC1363Receiver = await ethers.getContractFactory('ERC1363ReceiverMock');
          const contextMockFactoryERC1363Receiver = await FactoryERC1363Receiver.deploy(RECEIVER_MAGIC_VALUE, false);
          await contextMockFactoryERC1363Receiver.deployed();
          const erc1363Receiver = contextMockFactoryERC1363Receiver;
          this.erc1363Receiver = erc1363Receiver;
          const tx = await this.token.connect(sender).increaseAllowance(spender.address, balance);
          await tx.wait();
        });

        describe('when the sender does not have enough balance', function () {
          const amount = balance.add(1);

          describe('with data', function () {
            it('reverts', async function () {
              expect(
                transferFromAndCallWithData(this.token, sender.address, this.erc1363Receiver.address, amount, spender)
              ).to.be.revertedWith('ERC20: insufficient allowance');
            });
          });

          describe('without data', function () {
            it('reverts', async function () {
              await expect(
                transferFromAndCallWithoutData(
                  this.token,
                  sender.address,
                  this.erc1363Receiver.address,
                  amount,
                  spender
                )
              ).to.be.revertedWith('ERC20: insufficient allowance');
            });
          });
        });

        describe('when the sender has enough balance', function () {
          const amount = balance;
          describe('with data', function () {
            it('transfers the requested amount', async function () {
              await transferFromAndCallWithData(
                this.token,
                sender.address,
                this.erc1363Receiver.address,
                amount,
                spender
              );
              const senderBalance = await this.token.balanceOf(sender.address);
              expect(senderBalance).to.be.equal(BigNumber.from(0));
              const recipientBalance = await this.token.balanceOf(this.erc1363Receiver.address);
              expect(recipientBalance).to.be.equal(amount);
            });

            it('emits a transfer event', async function () {
              const tx = await this.token.connect(sender).increaseAllowance(spender.address, amount);
              await tx.wait();
              const logs = transferFromAndCallWithData(
                this.token,
                sender.address,
                this.erc1363Receiver.address,
                amount,
                spender
              );
              await expect(logs)
                .to.emit(this.token, 'Transfer')
                .withArgs(sender.address, this.erc1363Receiver.address, amount);
            });
          });

          describe('without data', function () {
            it('transfers the requested amount', async function () {
              await transferFromAndCallWithoutData(
                this.token,
                sender.address,
                this.erc1363Receiver.address,
                amount,
                spender
              );

              const senderBalance = await this.token.balanceOf(sender.address);
              expect(senderBalance).to.be.equal(BigNumber.from(0));

              const recipientBalance = await this.token.balanceOf(this.erc1363Receiver.address);
              expect(recipientBalance).to.be.equal(amount);
            });
            it('emits a transfer event', async function () {
              const logs = transferFromAndCallWithoutData(
                this.token,
                sender.address,
                this.erc1363Receiver.address,
                amount,
                spender
              );
              await expect(logs)
                .to.emit(this.token, 'Transfer')
                .withArgs(sender.address, this.erc1363Receiver.address, amount);
            });
          });
        });
      }

      describe('with data', function () {
        shouldTransferFromSafely(DATA);
      });

      describe('without data', function () {
        shouldTransferFromSafely(null);
      });

      describe('testing ERC20 behaviours', function () {
        transferFromWasSuccessful(signers.initialHolder, signers.spender, initialSupply);
      });

      describe('to a receiver that is not a contract', function () {
        it('reverts', async function () {
          const tx = await this.token
            .connect(signers.initialHolder)
            .increaseAllowance(signers.spender.address, initialSupply);
          await tx.wait();
          await expect(
            transferFromAndCallWithoutData(
              this.token,
              signers.initialHolder.address,
              signers.recipient.address,
              initialSupply,
              signers.spender
            )
          ).to.be.revertedWith('ERC1363: _checkAndCallTransfer');
        });
      });

      describe('to a receiver contract returning unexpected value', function () {
        this.beforeEach(async function () {
          const FactoryERC1363Receiver = await ethers.getContractFactory('ERC1363ReceiverMock');
          const contextMockFactoryERC1363Receiver = await FactoryERC1363Receiver.deploy(RECEIVER_MAGIC_VALUE, false);
          await contextMockFactoryERC1363Receiver.deployed();
          this.erc1363Receiver = contextMockFactoryERC1363Receiver;
          const tx = await this.token
            .connect(signers.initialHolder)
            .increaseAllowance(signers.spender.address, initialSupply);
          await tx.wait();
        });
        it('reverts', async function () {
          expect(
            transferFromAndCallWithoutData(
              this.token,
              signers.initialHolder.address,
              this.erc1363Receiver.address,
              initialSupply,
              signers.spender
            )
          ).to.be.revertedWith('ERC1363: _checkAndCallTransfer');
        });
      });

      describe('to a receiver contract that throws', function () {
        this.beforeEach(async function () {
          const tx = await this.token
            .connect(signers.initialHolder)
            .increaseAllowance(signers.spender.address, initialSupply);
          await tx.wait();
        });
        it('reverts', async function () {
          const FactoryERC1363Receiver = await ethers.getContractFactory('ERC1363ReceiverMock');
          const contextMockFactoryERC1363Receiver = await FactoryERC1363Receiver.deploy(RECEIVER_MAGIC_VALUE, true);
          await contextMockFactoryERC1363Receiver.deployed();
          this.erc1363Receiver = contextMockFactoryERC1363Receiver;
          await expect(
            transferFromAndCallWithoutData(
              this.token,
              signers.initialHolder.address,
              this.erc1363Receiver.address,
              initialSupply,
              signers.spender
            )
          ).to.be.revertedWith('ERC1363ReceiverMock: throwing');
        });
      });

      describe('to a contract that does not implement the required function', function () {
        it('reverts', async function () {
          await expect(
            transferFromAndCallWithoutData(
              this.token,
              signers.owner.address,
              this.token.address,
              initialSupply,
              signers.spender
            )
          ).to.be.reverted;
        });
      });
    });

    describe('via transferAndCall', function () {
      function transferAndCallWithData(token: any, to: any, value: any, opts: any) {
        return token.connect(opts)['transferAndCall(address,uint256,bytes)'](to, value, DATA);
      }

      function transferAndCallWithoutData(token: any, to: any, value: any, opts: any) {
        return token.connect(opts)['transferAndCall(address,uint256)'](to, value);
      }

      function shouldTransferSafely(data: any) {
        describe('to a valid receiver contract', function () {
          beforeEach(async function () {
            const FactoryERC1363Receiver = await ethers.getContractFactory('ERC1363ReceiverMock');
            const contextMockFactoryERC1363Receiver = await FactoryERC1363Receiver.deploy(RECEIVER_MAGIC_VALUE, false);
            await contextMockFactoryERC1363Receiver.deployed();
            this.erc1363Receiver = contextMockFactoryERC1363Receiver;
          });

          it('should call onTransferReceived', async function () {
            const receipt =
              data != null
                ? this.token
                    .connect(this.signers.initialHolder)
                    ['transferAndCall(address,uint256,bytes)'](this.erc1363Receiver.address, initialSupply, data)
                : this.token
                    .connect(this.signers.initialHolder)
                    ['transferAndCall(address,uint256)'](this.erc1363Receiver.address, initialSupply);
            expect(receipt)
              .to.emit(this.erc1363Receiver, 'Received')
              .withArgs(
                signers.initialHolder.address,
                signers.initialHolder.address,
                initialSupply,
                data,
                1_000_000_000
              );
          });
        });
      }

      function transferWasSuccessful(sender: SignerWithAddress, balance: BigNumber) {
        let receiver: any;

        beforeEach(async function () {
          const FactoryERC1363Receiver = await ethers.getContractFactory('ERC1363ReceiverMock');
          const contextMockFactoryERC1363Receiver = await FactoryERC1363Receiver.deploy(RECEIVER_MAGIC_VALUE, false);
          await contextMockFactoryERC1363Receiver.deployed();
          const erc1363Receiver = contextMockFactoryERC1363Receiver;
          const receiverContract = erc1363Receiver;
          receiver = receiverContract.address;
        });

        describe('when the sender does not have enough balance', function () {
          const amount = balance.add(1);

          describe('with data', function () {
            it('reverts', async function () {
              await expect(transferAndCallWithData(this.token, receiver, amount, sender)).to.be.revertedWith(
                'ERC20: transfer amount exceeds balance'
              );
            });
          });

          describe('without data', function () {
            it('reverts', async function () {
              await expect(transferAndCallWithoutData(this.token, receiver, amount, sender)).to.be.revertedWith(
                'ERC20: transfer amount exceeds balance'
              );
            });
          });
        });

        describe('when the sender has enough balance', function () {
          const amount = balance;
          describe('with data', function () {
            it('transfers the requested amount', async function () {
              await transferAndCallWithData(this.token, receiver, amount, sender);

              const senderBalance = await this.token.balanceOf(sender.address);
              expect(senderBalance).to.equal(BigNumber.from(0));
              const recipientBalance = await this.token.balanceOf(receiver);
              expect(recipientBalance).to.equal(amount);
            });

            it('emits a transfer event', async function () {
              const logs = transferAndCallWithData(this.token, receiver, amount, sender);
              await expect(logs).to.emit(this.token, 'Transfer').withArgs(sender.address, receiver, amount);
            });
          });

          describe('without data', function () {
            it('transfers the requested amount', async function () {
              await transferAndCallWithoutData(this.token, receiver, amount, sender);

              const senderBalance = await this.token.balanceOf(sender.address);
              expect(senderBalance).to.equal(BigNumber.from(0));
              const recipientBalance = await this.token.balanceOf(receiver);
              expect(recipientBalance).to.equal(amount);
            });

            it('emits a transfer event', async function () {
              const logs = transferAndCallWithoutData(this.token, receiver, amount, sender);
              await expect(logs).to.emit(this.token, 'Transfer').withArgs(sender.address, receiver, amount);
            });
          });
        });
      }

      describe('with data', function () {
        shouldTransferSafely(DATA);
      });

      describe('without data', function () {
        shouldTransferSafely(null);
      });

      describe('testing ERC20 behaviours', function () {
        transferWasSuccessful(signers.initialHolder, initialSupply);
      });

      describe('to a receiver that is not a contract', function () {
        this.beforeEach(async function () {});
        it('reverts', async function () {
          await expect(
            transferAndCallWithoutData(this.token, signers.recipient.address, initialSupply, signers.initialHolder)
          ).to.be.revertedWith('ERC1363: _checkAndCallTransfer');
        });
      });

      describe('to a receiver contract returning unexpected value', function () {
        this.beforeEach(async function () {
          const FactoryERC1363Receiver = await ethers.getContractFactory('ERC1363ReceiverMock');
          const contextMockFactoryERC1363Receiver = await FactoryERC1363Receiver.deploy(DATA, false);
          await contextMockFactoryERC1363Receiver.deployed();
          this.erc1363Receiver = contextMockFactoryERC1363Receiver;
        });
        it('reverts', async function () {
          expect(
            transferAndCallWithoutData(
              this.token,
              this.erc1363Receiver.address,
              initialSupply,
              this.signers.initialHolder
            )
          ).to.be.revertedWith('ERC1363: _checkAndCallTransfer');
        });
      });

      describe('to a receiver contract that throws', function () {
        it('reverts', async function () {
          const FactoryERC1363Receiver = await ethers.getContractFactory('ERC1363ReceiverMock');
          const contextMockFactoryERC1363Receiver = await FactoryERC1363Receiver.deploy(RECEIVER_MAGIC_VALUE, true);
          await contextMockFactoryERC1363Receiver.deployed();
          const erc1363Receiver = contextMockFactoryERC1363Receiver;
          const invalidReceiver = erc1363Receiver;

          expect(
            transferAndCallWithoutData(this.token, invalidReceiver.address, initialSupply, signers.initialHolder)
          ).to.be.revertedWith('ERC1363ReceiverMock: throwing');
        });
      });

      describe('to a contract that does not implement the required function', function () {
        it('reverts', async function () {
          const invalidReceiver = this.token;
          await expect(
            transferAndCallWithoutData(this.token, invalidReceiver.address, initialSupply, signers.initialHolder)
          ).to.be.reverted;
        });
      });
    });

    describe('via approveAndCall', function () {
      function approveAndCallWithData(token: any, spender: any, value: any, opts: any) {
        return token.connect(opts)['approveAndCall(address,uint256,bytes)'](spender, value, DATA);
      }

      function approveAndCallWithoutData(token: any, spender: any, value: any, opts: any) {
        return token.connect(opts)['approveAndCall(address,uint256)'](spender, value);
      }

      function shouldApproveSafely(data: any) {
        describe('to a valid receiver contract', function () {
          beforeEach(async function () {
            const FactoryERC1363Spender = await ethers.getContractFactory('ERC1363SpenderMock');
            const contextMockFactoryERC1363Spenderr = await FactoryERC1363Spender.deploy(SPENDER_MAGIC_VALUE, false);
            await contextMockFactoryERC1363Spenderr.deployed();
            this.erc1363Spender = contextMockFactoryERC1363Spenderr;
          });

          it('should call onApprovalReceived', async function () {
            const receipt =
              data != null
                ? approveAndCallWithData(this.token, this.erc1363Spender.address, initialSupply, signers.initialHolder)
                : approveAndCallWithoutData(
                    this.token,
                    this.erc1363Spender.address,
                    initialSupply,
                    signers.initialHolder
                  );
            expect(receipt)
              .to.emit(this.erc1363Spender, 'Approved')
              .withArgs(signers.initialHolder.address, initialSupply, data, BigNumber.from(28063946));
          });
        });
      }

      function approveWasSuccessful(sender: SignerWithAddress, amount: BigNumber) {
        let spender: any;

        beforeEach(async function () {
          const FactoryERC1363Spender = await ethers.getContractFactory('ERC1363SpenderMock');
          const contextMockFactoryERC1363Spenderr = await FactoryERC1363Spender.deploy(SPENDER_MAGIC_VALUE, false);
          await contextMockFactoryERC1363Spenderr.deployed();
          const erc1363Spender = contextMockFactoryERC1363Spenderr;
          const spenderContract = erc1363Spender;
          spender = spenderContract.address;
        });

        describe('with data', function () {
          it('approves the requested amount', async function () {
            await approveAndCallWithData(this.token, spender, amount, sender);

            const spenderAllowance = await this.token.allowance(sender.address, spender);
            expect(spenderAllowance).to.be.equal(amount);
          });

          it('emits an approval event', async function () {
            const logs = approveAndCallWithData(this.token, spender, amount, sender);
            await expect(logs).to.emit(this.token, 'Approval').withArgs(sender.address, spender, amount);
          });
        });

        describe('without data', function () {
          it('approves the requested amount', async function () {
            await approveAndCallWithoutData(this.token, spender, amount, sender);

            const spenderAllowance = await this.token.allowance(sender.address, spender);
            expect(spenderAllowance).to.be.equal(amount);
          });

          it('emits an approval event', async function () {
            const logs = approveAndCallWithoutData(this.token, spender, amount, sender);
            await expect(logs).to.emit(this.token, 'Approval').withArgs(sender.address, spender, amount);
          });
        });
      }

      describe('with data', function () {
        shouldApproveSafely(DATA);
      });

      describe('without data', function () {
        shouldApproveSafely(null);
      });

      describe('testing ERC20 behaviours', function () {
        approveWasSuccessful(signers.owner, initialSupply);
      });

      describe('to a spender that is not a contract', function () {
        it('reverts', async function () {
          await expect(
            approveAndCallWithoutData(this.token, signers.recipient.address, initialSupply, signers.owner)
          ).to.be.revertedWith('ERC1363: _checkAndCallApprove');
        });
      });

      describe('to a spender contract returning unexpected value', function () {
        it('reverts', async function () {
          const FactoryERC1363Spender = await ethers.getContractFactory('ERC1363SpenderMock');
          const contextMockFactoryERC1363Spenderr = await FactoryERC1363Spender.deploy(DATA, false);
          await contextMockFactoryERC1363Spenderr.deployed();
          this.erc1363Spender = contextMockFactoryERC1363Spenderr;
          expect(
            approveAndCallWithoutData(
              this.token,
              this.erc1363Spender.address,
              initialSupply,
              this.signers.initialHolder
            )
          ).to.be.revertedWith('ERC1363: _checkAndCallApprove');
        });
      });

      describe('to a spender contract that throws', function () {
        it('reverts', async function () {
          const FactoryERC1363Spender = await ethers.getContractFactory('ERC1363SpenderMock');
          const contextMockFactoryERC1363Spenderr = await FactoryERC1363Spender.deploy(SPENDER_MAGIC_VALUE, true);
          await contextMockFactoryERC1363Spenderr.deployed();
          this.erc1363Spender = contextMockFactoryERC1363Spenderr;
          expect(
            approveAndCallWithoutData(
              this.token,
              this.erc1363Spender.address,
              initialSupply,
              this.signers.initialHolder
            )
          ).to.be.revertedWith('ERC1363SpenderMock: throwing');
        });
      });

      describe('to a contract that does not implement the required function', function () {
        it('reverts', async function () {
          const invalidSpender = this.token;

          await expect(approveAndCallWithoutData(this.token, invalidSpender.address, initialSupply, signers.owner)).to
            .be.reverted;
        });
      });
    });
  });
}
