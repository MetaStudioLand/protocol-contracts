import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {Contract} from "ethers";

export async function doTransfert(
  contract: Contract,
  from: SignerWithAddress,
  to: SignerWithAddress,
  amount: number
) {
  const initialFromBalance = await contract.balanceOf(from.address);
  const initialToBalance = await contract.balanceOf(to.address);
  console.debug(`Balances from=${initialFromBalance} - to=${initialToBalance}`);

  // Transfer another amount tokens from from.address to to.address.
  await contract.connect(from).transfer(to.address, amount);

  // Check balances.
  const finalFromBalance = await contract.balanceOf(from.address);
  expect(finalFromBalance).to.equal(initialFromBalance.sub(amount));

  const finalToBalance = await contract.balanceOf(to.address);
  expect(finalToBalance).to.equal(initialToBalance.add(amount));
}
