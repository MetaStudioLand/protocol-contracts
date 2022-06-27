import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { web3 } from "@openzeppelin/test-environment";
import { BigNumber } from "ethers";

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect} = require('chai');

const ERC777SenderRecipientMock =  ethers.getContractFactory("ERC777SenderRecipientMock");

function shouldBehaveLikeERC777DirectSendBurn (holder: SignerWithAddress, recipient: SignerWithAddress, data: any) {
  shouldBehaveLikeERC777DirectSend(holder, recipient, data);
  shouldBehaveLikeERC777DirectBurn(holder, data);
}

function shouldBehaveLikeERC777OperatorSendBurn (holder: SignerWithAddress, recipient: SignerWithAddress, operator: SignerWithAddress, data: any, operatorData: any) {
  shouldBehaveLikeERC777OperatorSend(holder, recipient, operator, data, operatorData);
  shouldBehaveLikeERC777OperatorBurn(holder, operator, data, operatorData);
}

function shouldBehaveLikeERC777UnauthorizedOperatorSendBurn (holder: SignerWithAddress, recipient: SignerWithAddress, operator: SignerWithAddress, data: any, operatorData: any) {
  shouldBehaveLikeERC777UnauthorizedOperatorSend(holder, recipient, operator, data, operatorData);
  shouldBehaveLikeERC777UnauthorizedOperatorBurn(holder, operator, data, operatorData);
}

function shouldBehaveLikeERC777DirectSend (holder: SignerWithAddress, recipient: SignerWithAddress, data: any) {
  describe('direct send', function () {
    context('when the sender has tokens', function () {
      shouldDirectSendTokens(holder, recipient, BigNumber.from(0), data);
      shouldDirectSendTokens(holder, recipient, BigNumber.from(1), data);

      it('reverts when sending more than the balance', async function () {
        const balance = await this.token.balanceOf(holder.address);
        await expect(
          this.token
            .connect(holder)
            .send(recipient.address, BigNumber.from(balance).add(1), data)
        ).to.be.reverted;
        //await expectRevert.unspecified(this.token.connect(holder).send(recipient.address, BigNumber.from(balance).add(1), data));
      });

      it('reverts when sending to the zero address', async function () {
        await expectRevert.unspecified(this.token.send(ZERO_ADDRESS, BigNumber.from(1), data));
      });
    });

    context('when the sender has no tokens', function () {
      removeBalance(holder); 
      shouldDirectSendTokens(holder, recipient, BigNumber.from(0), data);

      it('reverts when sending a non-zero amount', async function () {
        await expect(
          this.token
            .connect(holder)
            .send(recipient.address, BigNumber.from(1), data)
        ).to.be.reverted;
        // await expectRevert.unspecified(this.token.connect(holder).send(recipient.address, BigNumber.from(1), data));
      });
    });
  });
}

function shouldBehaveLikeERC777OperatorSend (holder: SignerWithAddress, recipient: SignerWithAddress, operator: SignerWithAddress, data: any, operatorData: any) {
  describe('operator send', function () {
    context('when the sender has tokens', async function () {
      shouldOperatorSendTokens(holder, operator, recipient, BigNumber.from(0), data, operatorData);
      shouldOperatorSendTokens(holder, operator, recipient, BigNumber.from(1), data, operatorData);

      it('reverts when sending more than the balance', async function () {
        const balance = await this.token.balanceOf(holder.address);
        await expect(
          this.token
            .connect(operator)
            .operatorSend(holder.address, recipient.address, BigNumber.from(balance).add(1), data, operatorData)
        ).to.be.reverted;
        // await expectRevert.unspecified(
        //   this.token.connect(operator).operatorSend(holder.address, recipient.address, BigNumber.from(balance).add(1), data, operatorData),
        // );
      });

      it('reverts when sending to the zero address', async function () {
        await expectRevert.unspecified(
          this.token.connect(operator).operatorSend(
            holder.address, ZERO_ADDRESS, BigNumber.from(1), data, operatorData,
          ),
        );
      });
    });

    context('when the sender has no tokens', function () {
      removeBalance(holder);

      shouldOperatorSendTokens(holder, operator, recipient, BigNumber.from(0), data, operatorData);

      it('reverts when sending a non-zero amount', async function () {
        await expectRevert.unspecified(
          this.token.connect(operator).operatorSend(holder.address, recipient.address, BigNumber.from(1), data, operatorData),
        );
      });

      it('reverts when sending from the zero address', async function () {
        // This is not yet reflected in the spec
        await expect(
          this.token
            .connect(operator)
            .operatorSend(ZERO_ADDRESS, recipient.address, BigNumber.from(0), data, operatorData)
        ).to.be.reverted; 
        // await expectRevert.unspecified(
        //   this.token.connect(operator).operatorSend(
        //     ZERO_ADDRESS, recipient.address, BigNumber.from(0), data, operatorData
        //   ),
        // );
      });
    });
  });
}

function shouldBehaveLikeERC777UnauthorizedOperatorSend (holder: SignerWithAddress, recipient: SignerWithAddress, operator: SignerWithAddress, data: any, operatorData: any) {
  describe('operator send', function () {
    it('reverts', async function () {
      await expectRevert.unspecified(this.token.operatorSend(holder.address, recipient.address, BigNumber.from(0), data, operatorData));
    });
  });
}

function shouldBehaveLikeERC777DirectBurn (holder: SignerWithAddress, data: any) {
  describe('direct burn', function () {
    context('when the sender has tokens', function () {
      shouldDirectBurnTokens(holder, BigNumber.from(0), data);
      shouldDirectBurnTokens(holder, BigNumber.from(1), data);

      it('reverts when burning more than the balance', async function () {
        const balance = await this.token.balanceOf(holder.address);
        await expect(
          this.token
            .connect(holder)
            .burn(BigNumber.from(balance).add(1), data)
        ).to.be.reverted
        // await expectRevert.unspecified(this.token.connect(holder).burn(BigNumber.from(balance).add(1), data));
      });
    });

    context('when the sender has no tokens', function () {
      removeBalance(holder);

      shouldDirectBurnTokens(holder, BigNumber.from(0), data);

      it('reverts when burning a non-zero amount', async function () {
        await expect(
          this.token
            .connect(holder)
            .burn(BigNumber.from(1), data)
        ).to.be.reverted
        // await expectRevert.unspecified(this.token.connect(holder).burn(BigNumber.from(1), data));
      });
    });
  });
}

function shouldBehaveLikeERC777OperatorBurn (holder: SignerWithAddress, operator: SignerWithAddress, data: any, operatorData: any) {
  describe('operator burn', function () {
    context('when the sender has tokens', async function () {
      shouldOperatorBurnTokens(holder, operator, BigNumber.from(0), data, operatorData);
      shouldOperatorBurnTokens(holder, operator, BigNumber.from(1), data, operatorData);

      it('reverts when burning more than the balance', async function () {
        const balance = await this.token.balanceOf(holder.address);
        await expect(
          this.token
            .connect(operator)
            .operatorBurn(holder.address, BigNumber.from(balance).add(1) , data, operatorData)
        ).to.be.reverted
        // await expectRevert.unspecified(
        //   this.token.connect(operator).operatorBurn(holder.address, BigNumber.from(balance).add(1) , data, operatorData),
        // );
      });
    });

    context('when the sender has no tokens', function () {
      removeBalance(holder);

      shouldOperatorBurnTokens(holder, operator, BigNumber.from(0), data, operatorData);

      it('reverts when burning a non-zero amount', async function () {
        await expect(
          this.token
            .connect(operator)
            .operatorBurn(holder.address, BigNumber.from(1), data, operatorData)
        ).to.be.reverted
        // await expectRevert.unspecified(
        //   this.token.connect(operator).operatorBurn(holder.address, BigNumber.from(1), data, operatorData),
        // );
      });

      it('reverts when burning from the zero address', async function () {
        // This is not yet reflected in the spec
        await expect(
          this.token
            .connect(operator)
            .operatorBurn( ZERO_ADDRESS, BigNumber.from(0), data, operatorData)
        ).to.be.reverted
        // await expectRevert.unspecified(
        //   this.token.connect(operator).operatorBurn(
        //     ZERO_ADDRESS, BigNumber.from(0), data, operatorData,
        //   ),
        // );
      });
    });
  });
}

function shouldBehaveLikeERC777UnauthorizedOperatorBurn (holder: SignerWithAddress, operator: SignerWithAddress, data: any, operatorData: any) {
  describe('operator burn', function () {
    it('reverts', async function () {
      await expect(
        this.token
          .operatorBurn(holder.address, BigNumber.from(0), data, operatorData)
      ).to.be.reverted
      // await expectRevert.unspecified(this.token.operatorBurn(holder.address, BigNumber.from(0), data, operatorData));
    });
  });
}

function shouldDirectSendTokens (from: SignerWithAddress, to: SignerWithAddress, amount: any, data: any) {
  shouldSendTokens(from, null, to, amount, data, null);
}

function shouldOperatorSendTokens (from: SignerWithAddress, operator: any, to: SignerWithAddress, amount: any, data: any, operatorData: any) {
  shouldSendTokens(from, operator, to, amount, data, operatorData);
}

function shouldSendTokens (from: SignerWithAddress, operator: SignerWithAddress| null, to: SignerWithAddress, amount: any, data: any, operatorData: null) {
  const operatorCall = operator !== null;

  it(`${operatorCall ? 'operator ' : ''}can send an amount of ${amount}`, async function () {
    const initialTotalSupply = await this.token.totalSupply();
    const initialFromBalance = await this.token.balanceOf(from.address);
    const initialToBalance = await this.token.balanceOf(to.address);

    let receipt;
    if (!operatorCall) {
      (receipt = await this.token.connect(from).send(to.address, amount, data));
       expect(receipt)
      .to.emit(this.token, "Sent")
      .withArgs(
       from.address,
        from.address,
        to.address,
        amount,
        data,
       null
       );
    } else {
      (receipt = await this.token.connect(operator).operatorSend(from.address, to.address, amount, data, operatorData));
      
       expect(receipt)
            .to.emit(this.token, "Sent")
            .withArgs(
               operator.address,
              from.address,
              to.address,
              amount,
              data,
              operatorData);
    }

     expect(receipt)
    .to.emit(this.token, "Transfer")
    .withArgs(
      from.address,
      to.address,
     amount);
    const finalTotalSupply = await this.token.totalSupply();
    const finalFromBalance = await this.token.balanceOf(from.address);
    const finalToBalance = await this.token.balanceOf(to.address);

    expect(BigNumber.from(finalTotalSupply)).to.be.equal(BigNumber.from(initialTotalSupply) );
    expect(BigNumber.from(finalToBalance).sub(initialToBalance)).to.be.equal(BigNumber.from(amount));
    expect(BigNumber.from(finalFromBalance).sub(initialFromBalance)).to.be.equal(BigNumber.from(amount).mul(-1));
  });
}

function shouldDirectBurnTokens (from: SignerWithAddress, amount: any, data: any) {
  shouldBurnTokens(from, null, amount, data, null);
}

function shouldOperatorBurnTokens (from: SignerWithAddress, operator: any, amount: any, data: any, operatorData: any) {
  shouldBurnTokens(from, operator, amount, data, operatorData);
}

function shouldBurnTokens (from: SignerWithAddress, operator: SignerWithAddress | null, amount: any, data: any, operatorData: null) {
  const operatorCall = operator !== null;

  it(`${operatorCall ? 'operator ' : ''}can burn an amount of ${amount}`, async function () {
    const initialTotalSupply = await this.token.totalSupply();
    const initialFromBalance = await this.token.balanceOf(from.address);

    let receipt;
    if (!operatorCall) {
      (receipt = await this.token.connect(from).burn(amount, data));
 
       expect(receipt)
    .to.emit(this.token, "Burned")
    .withArgs(from.address,
      from.address,
      amount,
      data,
       null);
    } else {
      (receipt = await this.token.connect(operator).operatorBurn(from.address, amount, data, operatorData));
  
      // await expect(
      //  receipt
      // ).withArgs( operator.address,
      //   from.address,
      //   amount,
      //   data,
      //   operatorData).to.be.revertedWith("ERC777: caller is not an operator for holder");


       expect(receipt)
      .to.emit(this.token, "Burned")
      .withArgs( operator.address,
        from.address,
        amount,
        data,
        operatorData);
    }
     expect(receipt)
      .to.emit(this.token, "Transfer")
      .withArgs(  from.address,
        ZERO_ADDRESS,
        amount);

    const finalTotalSupply = await this.token.totalSupply();
    const finalFromBalance = await this.token.balanceOf(from.address);

    expect( BigNumber.from(finalTotalSupply).sub(initialTotalSupply)).to.be.equal(BigNumber.from(amount).mul(-1));
    expect(BigNumber.from(finalFromBalance).sub(initialFromBalance)).to.be.equal(BigNumber.from(amount).mul(-1));
  });
}

function shouldBehaveLikeERC777InternalMint (recipient: SignerWithAddress, operator: SignerWithAddress, amount: any, data: any, operatorData: any) {
  shouldInternalMintTokens(operator, recipient, BigNumber.from(0), data, operatorData);
  shouldInternalMintTokens(operator, recipient, amount, data, operatorData);

  it('reverts when minting tokens for the zero address', async function () {
    await expectRevert.unspecified(
      this.token.connect(operator).mintInternal(ZERO_ADDRESS, amount, data, operatorData),
    );
  });
}

function shouldInternalMintTokens (operator: SignerWithAddress, to: SignerWithAddress, amount: any, data: any, operatorData: any) {
  it(`can (internal) mint an amount of ${amount}`, async function () {
    const initialTotalSupply = await this.token.totalSupply();
    const initialToBalance = await this.token.balanceOf(to.address);

    const receipt = await this.token.connect(operator).mintInternal(to.address, amount, data, operatorData);

  
    await expect(receipt)
      .to.emit(this.token, "Minted")
      .withArgs(   operator.address,
        to.address,
        amount,
        data,
        operatorData,);

    await expect(receipt)
      .to.emit(this.token, "Transfer")
      .withArgs( ZERO_ADDRESS,
        to.address,
         amount,);
    const finalTotalSupply = await this.token.totalSupply();
    const finalToBalance = await this.token.balanceOf(to.address);

    expect(finalTotalSupply.sub(initialTotalSupply)).to.be.bignumber.equal(amount);
    expect(finalToBalance.sub(initialToBalance)).to.be.bignumber.equal(amount);
  });
}

function shouldBehaveLikeERC777SendBurnMintInternalWithReceiveHook (operator: SignerWithAddress, amount: any, data: any, operatorData: any) {
  context('when TokensRecipient reverts', function () {
    beforeEach(async function () {
      await this.tokensRecipientImplementer.setShouldRevertReceive(true);
    });

    it('send reverts', async function () {
      await expectRevert.unspecified(sendFromHolder(this.token, this.sender, this.recipient, amount, data));
    });

    it('operatorSend reverts', async function () {
      await expectRevert.unspecified(
        this.token.operatorSend(this.sender, this.recipient, amount, data, operatorData, { from: operator }),
      );
    });

    it('mint (internal) reverts', async function () {
      await expectRevert.unspecified(
        this.token.mintInternal(this.recipient, amount, data, operatorData, { from: operator }),
      );
    });
  });

  context('when TokensRecipient does not revert', function () {
    beforeEach(async function () {
      await this.tokensRecipientImplementer.setShouldRevertSend(false);
    });

    it('TokensRecipient receives send data and is called after state mutation', async function () {
      const { tx } = await sendFromHolder(this.token, this.sender, this.recipient, amount, data);

      const postSenderBalance = await this.token.balanceOf(this.sender);
      const postRecipientBalance = await this.token.balanceOf(this.recipient);

      await assertTokensReceivedCalled(
        this.token,
        tx,
        this.sender,
        this.sender,
        this.recipient,
        amount,
        data,
        null,
        postSenderBalance,
        postRecipientBalance,
      );
    });

    it('TokensRecipient receives operatorSend data and is called after state mutation', async function () {
      const { tx } = await this.token.operatorSend(
        this.sender, this.recipient, amount, data, operatorData,
        { from: operator },
      );

      const postSenderBalance = await this.token.balanceOf(this.sender);
      const postRecipientBalance = await this.token.balanceOf(this.recipient);

      await assertTokensReceivedCalled(
        this.token,
        tx,
        operator,
        this.sender,
        this.recipient,
        amount,
        data,
        operatorData,
        postSenderBalance,
        postRecipientBalance,
      );
    });

    it('TokensRecipient receives mint (internal) data and is called after state mutation', async function () {
      const { tx } = await this.token.mintInternal(
        this.recipient, amount, data, operatorData, { from: operator },
      );

      const postRecipientBalance = await this.token.balanceOf(this.recipient);

      await assertTokensReceivedCalled(
        this.token,
        tx,
        operator,
        ZERO_ADDRESS,
        this.recipient,
        amount,
        data,
        operatorData,
        BigNumber.from(0),
        postRecipientBalance,
      );
    });
  });
}

function shouldBehaveLikeERC777SendBurnWithSendHook (operator: SignerWithAddress, amount: any, data: any, operatorData: any) {
  context('when TokensSender reverts', function () {
    beforeEach(async function () {
      await this.tokensSenderImplementer.setShouldRevertSend(true);
    });

    it('send reverts', async function () {
      await expectRevert.unspecified(sendFromHolder(this.token, this.sender, this.recipient, amount, data));
    });

    it('operatorSend reverts', async function () {
      await expectRevert.unspecified(
        this.token.operatorSend(this.sender, this.recipient, amount, data, operatorData, { from: operator }),
      );
    });

    it('burn reverts', async function () {
      await expectRevert.unspecified(burnFromHolder(this.token, this.sender, amount, data));
    });

    it('operatorBurn reverts', async function () {
      await expectRevert.unspecified(
        this.token.operatorBurn(this.sender, amount, data, operatorData, { from: operator }),
      );
    });
  });

  context('when TokensSender does not revert', function () {
    beforeEach(async function () {
      await this.tokensSenderImplementer.setShouldRevertSend(false);
    });

    it('TokensSender receives send data and is called before state mutation', async function () {
      const preSenderBalance = await this.token.balanceOf(this.sender);
      const preRecipientBalance = await this.token.balanceOf(this.recipient);

      const { tx } = await sendFromHolder(this.token, this.sender, this.recipient, amount, data);

      await assertTokensToSendCalled(
        this.token,
        tx,
        this.sender,
        this.sender,
        this.recipient,
        amount,
        data,
        null,
        preSenderBalance,
        preRecipientBalance,
      );
    });

    it('TokensSender receives operatorSend data and is called before state mutation', async function () {
      const preSenderBalance = await this.token.balanceOf(this.sender);
      const preRecipientBalance = await this.token.balanceOf(this.recipient);

      const { tx } = await this.token.operatorSend(
        this.sender, this.recipient, amount, data, operatorData,
        { from: operator },
      );

      await assertTokensToSendCalled(
        this.token,
        tx,
        operator,
        this.sender,
        this.recipient,
        amount,
        data,
        operatorData,
        preSenderBalance,
        preRecipientBalance,
      );
    });

    it('TokensSender receives burn data and is called before state mutation', async function () {
      const preSenderBalance = await this.token.balanceOf(this.sender);

      const { tx } = await burnFromHolder(this.token, this.sender, amount, data);

      await assertTokensToSendCalled(
        this.token, tx, this.sender, this.sender, ZERO_ADDRESS, amount, data, null, preSenderBalance,
      );
    });

    it('TokensSender receives operatorBurn data and is called before state mutation', async function () {
      const preSenderBalance = await this.token.balanceOf(this.sender);

      const { tx } = await this.token.operatorBurn(this.sender, amount, data, operatorData, { from: operator });

      await assertTokensToSendCalled(
        this.token, tx, operator, this.sender, ZERO_ADDRESS, amount, data, operatorData, preSenderBalance,
      );
    });
  });
}

function removeBalance (holder: SignerWithAddress) {
  beforeEach(async function () {
    await this.token.connect(holder).burn(await this.token.balanceOf(holder.address), '0x');
    expect(await this.token.balanceOf(holder.address)).to.be.equal(BigNumber.from(0));
  });
}

async function assertTokensReceivedCalled (token: { address: any; }, txHash: any, operator: any, from: any, to: any, amount: any, data: any, operatorData: null, fromBalance: any,
  toBalance = '0') {
  await expectEvent.inTransaction(txHash, ERC777SenderRecipientMock, 'TokensReceivedCalled', {
    operator, from, to, amount, data, operatorData, token: token.address, fromBalance, toBalance,
  });
}

async function assertTokensToSendCalled (token: { address: any; }, txHash: any, operator: any, from: any, to: any, amount: any, data: any, operatorData: null, fromBalance: any,
  toBalance = '0') {
  await expectEvent.inTransaction(txHash, ERC777SenderRecipientMock, 'TokensToSendCalled', {
    operator, from, to, amount, data, operatorData, token: token.address, fromBalance, toBalance,
  });
}

async function sendFromHolder (token: { send: (arg0: any, arg1: any, arg2: any, arg3: { from: any; }) => any; address: any; }, holder: any, to: any, amount: any, data: any) {
  if ((await web3.eth.getCode(holder)).length <= '0x'.length) {
    return token.send(to, amount, data, { from: holder });
  } else {
    // assume holder is ERC777SenderRecipientMock contract
    return (await ERC777SenderRecipientMock.at(holder)).send(token.address, to, amount, data);
  }
}

async function burnFromHolder (token: { burn: (arg0: any, arg1: any, arg2: { from: any; }) => any; address: any; }, holder: any, amount: any, data: any) {
  if ((await web3.eth.getCode(holder)).length <= '0x'.length) {
    return token.burn(amount, data, { from: holder });
  } else {
    // assume holder is ERC777SenderRecipientMock contract
    return (await ERC777SenderRecipientMock.at(holder)).burn(token.address, amount, data);
  }
}

module.exports = {
  shouldBehaveLikeERC777DirectSendBurn,
  shouldBehaveLikeERC777OperatorSendBurn,
  shouldBehaveLikeERC777UnauthorizedOperatorSendBurn,
  shouldBehaveLikeERC777InternalMint,
  shouldBehaveLikeERC777SendBurnMintInternalWithReceiveHook,
  shouldBehaveLikeERC777SendBurnWithSendHook,
};

export { };
