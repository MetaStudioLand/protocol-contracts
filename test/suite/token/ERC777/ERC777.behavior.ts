import { web3 } from "@openzeppelin/test-environment";
import { BigNumber } from "ethers";

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect} = require('chai');

const ERC777SenderRecipientMock =  ethers.getContractFactory("ERC777SenderRecipientMock");

function shouldBehaveLikeERC777DirectSendBurn (holder: any, recipient: any, data: any) {
  shouldBehaveLikeERC777DirectSend(holder, recipient, data);
  shouldBehaveLikeERC777DirectBurn(holder, data);
}

function shouldBehaveLikeERC777OperatorSendBurn (holder: any, recipient: any, operator: any, data: any, operatorData: any) {
  shouldBehaveLikeERC777OperatorSend(holder, recipient, operator, data, operatorData);
  shouldBehaveLikeERC777OperatorBurn(holder, operator, data, operatorData);
}

function shouldBehaveLikeERC777UnauthorizedOperatorSendBurn (holder: any, recipient: any, operator: any, data: any, operatorData: any) {
  shouldBehaveLikeERC777UnauthorizedOperatorSend(holder, recipient, operator, data, operatorData);
  shouldBehaveLikeERC777UnauthorizedOperatorBurn(holder, operator, data, operatorData);
}

function shouldBehaveLikeERC777DirectSend (holder: any, recipient: any, data: any) {
  describe('direct send', function () {
    context('when the sender has tokens', function () {
      shouldDirectSendTokens(holder, recipient, BigNumber.from(0), data);
      shouldDirectSendTokens(holder, recipient, BigNumber.from(1), data);

      it('reverts when sending more than the balance', async function () {
        const balance = await this.token.balanceOf(holder);
        await expectRevert.unspecified(this.token.send(recipient, balance, data));
      });

      it('reverts when sending to the zero address', async function () {
        await expectRevert.unspecified(this.token.send(ZERO_ADDRESS, BigNumber.from(1), data));
      });
    });

    context('when the sender has no tokens', function () {
      removeBalance(holder); 
      shouldDirectSendTokens(holder, recipient, BigNumber.from(0), data);

      it('reverts when sending a non-zero amount', async function () {
        await expectRevert.unspecified(this.token.send(recipient, BigNumber.from(1), data));
      });
    });
  });
}

function shouldBehaveLikeERC777OperatorSend (holder: any, recipient: any, operator: any, data: any, operatorData: any) {
  describe('operator send', function () {
    context('when the sender has tokens', async function () {
      shouldOperatorSendTokens(holder, operator, recipient, BigNumber.from(0), data, operatorData);
      shouldOperatorSendTokens(holder, operator, recipient, BigNumber.from(1), data, operatorData);

      it('reverts when sending more than the balance', async function () {
        const balance = await this.token.balanceOf(holder);
        await expectRevert.unspecified(
          this.token.connect(operator).operatorSend(holder, recipient, balance, data, operatorData),
        );
      });

      it('reverts when sending to the zero address', async function () {
        await expectRevert.unspecified(
          this.token.connect(operator).operatorSend(
            holder, ZERO_ADDRESS, BigNumber.from(1), data, operatorData,
          ),
        );
      });
    });

    context('when the sender has no tokens', function () {
      removeBalance(holder);

      shouldOperatorSendTokens(holder, operator, recipient, BigNumber.from(0), data, operatorData);

      it('reverts when sending a non-zero amount', async function () {
        await expectRevert.unspecified(
          this.token.operatorSend(holder, recipient, BigNumber.from(1), data, operatorData, { from: operator }),
        );
      });

      it('reverts when sending from the zero address', async function () {
        // This is not yet reflected in the spec
        await expectRevert.unspecified(
          this.token.operatorSend(
            ZERO_ADDRESS, recipient, BigNumber.from(0), data, operatorData, { from: operator },
          ),
        );
      });
    });
  });
}

function shouldBehaveLikeERC777UnauthorizedOperatorSend (holder: any, recipient: any, operator: any, data: any, operatorData: any) {
  describe('operator send', function () {
    it('reverts', async function () {
      await expectRevert.unspecified(this.token.operatorSend(holder, recipient, BigNumber.from(0), data, operatorData));
    });
  });
}

function shouldBehaveLikeERC777DirectBurn (holder: any, data: any) {
  describe('direct burn', function () {
    context('when the sender has tokens', function () {
      shouldDirectBurnTokens(holder, BigNumber.from(0), data);
      shouldDirectBurnTokens(holder, BigNumber.from(1), data);

      it('reverts when burning more than the balance', async function () {
        const balance = await this.token.balanceOf(holder);
        await expectRevert.unspecified(this.token.connect(holder).burn(balance, data));
      });
    });

    context('when the sender has no tokens', function () {
      removeBalance(holder);

      shouldDirectBurnTokens(holder, BigNumber.from(0), data);

      it('reverts when burning a non-zero amount', async function () {
        await expectRevert.unspecified(this.token.connect(holder).burn(BigNumber.from(1), data));
      });
    });
  });
}

function shouldBehaveLikeERC777OperatorBurn (holder: any, operator: any, data: any, operatorData: any) {
  describe('operator burn', function () {
    context('when the sender has tokens', async function () {
      shouldOperatorBurnTokens(holder, operator, BigNumber.from(0), data, operatorData);
      shouldOperatorBurnTokens(holder, operator, BigNumber.from(1), data, operatorData);

      it('reverts when burning more than the balance', async function () {
        const balance = await this.token.balanceOf(holder);
        await expectRevert.unspecified(
          this.token.connect(operator).operatorBurn(holder, balance, data, operatorData),
        );
      });
    });

    context('when the sender has no tokens', function () {
      removeBalance(holder);

      shouldOperatorBurnTokens(holder, operator, BigNumber.from(0), data, operatorData);

      it('reverts when burning a non-zero amount', async function () {
        await expectRevert.unspecified(
          this.token.connect(operator).operatorBurn(holder, BigNumber.from(1), data, operatorData),
        );
      });

      it('reverts when burning from the zero address', async function () {
        // This is not yet reflected in the spec
        await expectRevert.unspecified(
          this.token.connect(operator).operatorBurn(
            ZERO_ADDRESS, BigNumber.from(0), data, operatorData,
          ),
        );
      });
    });
  });
}

function shouldBehaveLikeERC777UnauthorizedOperatorBurn (holder: any, operator: any, data: any, operatorData: any) {
  describe('operator burn', function () {
    it('reverts', async function () {
      await expectRevert.unspecified(this.token.operatorBurn(holder, BigNumber.from(0), data, operatorData));
    });
  });
}

function shouldDirectSendTokens (from: any, to: any, amount: any, data: any) {
  shouldSendTokens(from, null, to, amount, data, null);
}

function shouldOperatorSendTokens (from: any, operator: any, to: any, amount: any, data: any, operatorData: any) {
  shouldSendTokens(from, operator, to, amount, data, operatorData);
}

function shouldSendTokens (from: any, operator: null, to: any, amount: any, data: any, operatorData: null) {
  const operatorCall = operator !== null;

  it(`${operatorCall ? 'operator ' : ''}can send an amount of ${amount}`, async function () {
    const initialTotalSupply = await this.token.totalSupply();
    const initialFromBalance = await this.token.balanceOf(from);
    const initialToBalance = await this.token.balanceOf(to);

    let receipt;
    if (!operatorCall) {
      (receipt = await this.token.send(to, BigNumber.from(0), data));
      await expect(receipt)
      .to.emit(this.token, "Sent")
      .withArgs(
       from,
        from,
        to,
        amount,
        data,
       null);
    } else {
      (receipt = await this.token.operatorSend(from, to, amount, data, operatorData));
      
      await expect(receipt)
            .to.emit(this.token, "Sent")
            .withArgs(
              from,
              to,
              amount,
              data,
              operatorData);
    }

    await expect(receipt)
    .to.emit(this.token, "Transfer")
    .withArgs(operator,
      from,
      to,
     amount);
    const finalTotalSupply = await this.token.totalSupply();
    const finalFromBalance = await this.token.balanceOf(from);
    const finalToBalance = await this.token.balanceOf(to);

    expect(finalTotalSupply).to.be.bignumber.equal(initialTotalSupply);
    expect(finalToBalance.sub(initialToBalance)).to.be.bignumber.equal(amount);
    expect(finalFromBalance.sub(initialFromBalance)).to.be.bignumber.equal(amount.neg());
  });
}

function shouldDirectBurnTokens (from: any, amount: any, data: any) {
  shouldBurnTokens(from, null, amount, data, null);
}

function shouldOperatorBurnTokens (from: any, operator: any, amount: any, data: any, operatorData: any) {
  shouldBurnTokens(from, operator, amount, data, operatorData);
}

function shouldBurnTokens (from: any, operator: null, amount: { neg: () => any; }, data: any, operatorData: null) {
  const operatorCall = operator !== null;

  it(`${operatorCall ? 'operator ' : ''}can burn an amount of ${amount}`, async function () {
    const initialTotalSupply = await this.token.totalSupply();
    const initialFromBalance = await this.token.balanceOf(from);

    let receipt;
    if (!operatorCall) {
      (receipt = await this.token.connect(from).burn(amount, data));
 
      await expect(receipt)
    .to.emit(this.token, "Burned")
    .withArgs(from,
      from,
      amount,
      data,
       null);
    } else {
      (receipt = await this.token.connect(operator).operatorBurn(from, amount, data, operatorData));
  
      await expect(receipt)
      .to.emit(this.token, "Burned")
      .withArgs(operator,
        from,
        amount,
        data,
        operatorData);
    }
    await expect(receipt)
      .to.emit(this.token, "Transfer")
      .withArgs(  from,
        ZERO_ADDRESS,
        amount);

    const finalTotalSupply = await this.token.totalSupply();
    const finalFromBalance = await this.token.balanceOf(from);

    expect(finalTotalSupply.sub(initialTotalSupply)).to.be.bignumber.equal(amount.neg());
    expect(finalFromBalance.sub(initialFromBalance)).to.be.bignumber.equal(amount.neg());
  });
}

function shouldBehaveLikeERC777InternalMint (recipient: any, operator: any, amount: any, data: any, operatorData: any) {
  shouldInternalMintTokens(operator, recipient, BigNumber.from(0), data, operatorData);
  shouldInternalMintTokens(operator, recipient, amount, data, operatorData);

  it('reverts when minting tokens for the zero address', async function () {
    await expectRevert.unspecified(
      this.token.connect(operator).mintInternal(ZERO_ADDRESS, amount, data, operatorData),
    );
  });
}

function shouldInternalMintTokens (operator: any, to: any, amount: any, data: any, operatorData: any) {
  it(`can (internal) mint an amount of ${amount}`, async function () {
    const initialTotalSupply = await this.token.totalSupply();
    const initialToBalance = await this.token.balanceOf(to);

    const receipt = await this.token.connect(operator).mintInternal(to, amount, data, operatorData);

  
    await expect(receipt)
      .to.emit(this.token, "Minted")
      .withArgs(   operator,
        to,
        amount,
        data,
        operatorData,);

    await expect(receipt)
      .to.emit(this.token, "Transfer")
      .withArgs( ZERO_ADDRESS,
        to,
         amount,);
    const finalTotalSupply = await this.token.totalSupply();
    const finalToBalance = await this.token.balanceOf(to);

    expect(finalTotalSupply.sub(initialTotalSupply)).to.be.bignumber.equal(amount);
    expect(finalToBalance.sub(initialToBalance)).to.be.bignumber.equal(amount);
  });
}

function shouldBehaveLikeERC777SendBurnMintInternalWithReceiveHook (operator: any, amount: any, data: any, operatorData: any) {
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

function shouldBehaveLikeERC777SendBurnWithSendHook (operator: any, amount: any, data: any, operatorData: any) {
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

function removeBalance (holder: any) {
  beforeEach(async function () {
    await this.token.connect(holder).burn(await this.token.balanceOf(holder), '0x');
    expect(await this.token.balanceOf(holder)).to.be.bignumber.equal(0);
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
