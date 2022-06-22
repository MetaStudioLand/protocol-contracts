// import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
// import {assert, expect} from "chai";
// import {BigNumber, Contract} from "ethers";
// import {tracer} from "hardhat";
// import {toBN} from "../helpers";
// import {ISuiteOptions} from "../suite";
//
// export async function runTestERC20(options: ISuiteOptions) {
//   const accounts = options.accounts;
//
//   const tokens = function (amount: number): BigNumber {
//     return toBN(amount).mul(toBN(10).pow(options.decimals));
//   };
//
//   // configure
//   const initialSupply = tokens(options.initialSupply);
//   const initialBalances = options.initialBalances || [];
//   const initialAllowances = options.initialAllowances || [];
//
//   const credit = async function (to: string, tokens: BigNumber) {
//     if (options.creditIsMinting) {
//       return await contract.mint(to, tokens);
//     } else {
//       return await contract.connect(tokensOwner).transfer(to, tokens);
//     }
//   };
//
//   // Setup
//   const uintMax = toBN(2).pow(toBN(256)).sub(1);
//   const contractOwner = accounts[0];
//   tracer.nameTags[contractOwner.address] = "contractOwner";
//   const tokensOwner =
//     accounts[options.tokensOwnerAccountIdx ? options.tokensOwnerAccountIdx : 0];
//   tracer.nameTags[tokensOwner.address] = "tokensOwner";
//
//   const firstUserAccountIdx =
//     options.firstUserAccountIdx ?? (options.tokensOwnerAccountIdx ?? 0) + 1;
//
//   const alice = accounts[firstUserAccountIdx];
//   tracer.nameTags[alice.address] = "alice";
//   const bob = accounts[firstUserAccountIdx + 1];
//   tracer.nameTags[bob.address] = "bob";
//   const charles = accounts[firstUserAccountIdx + 2];
//   tracer.nameTags[charles.address] = "charles";
//
//   let contract: Contract;
//
//   beforeEach(async function () {
//     contract = await options.create(options);
//     if (options.beforeEach) {
//       await options.beforeEach(contract, options);
//     }
//   });
//
//   afterEach(async function () {
//     if (options.afterEach) {
//       await options.afterEach(contract, options);
//     }
//   });
//
//   /*
//     Tests beginning
//    */
//
//   describe("ERC-20 Informations", function () {
//     describe("name()", function () {
//       it(`should return "${options.name}"`, async function () {
//         assert.equal(await contract.name(), options.name);
//       });
//     });
//
//     describe("symbol()", function () {
//       it(`should return "${options.symbol}"`, async function () {
//         assert.equal(await contract.symbol(), options.symbol);
//       });
//     });
//
//     describe("decimals()", function () {
//       it(`should return "${options.decimals}"`, async function () {
//         expect(await contract.decimals()).to.be.equal(toBN(options.decimals));
//       });
//     });
//   });
//
//   describe("ERC-20", function () {
//     describe("totalSupply()", async function () {
//       it(`should have initial supply of ${initialSupply}`, async function () {
//         expect(await contract.totalSupply()).to.be.equal(initialSupply);
//       });
//
//       if (options.tokensOwnerAccountIdx && options.tokensOwnerAccountIdx > 0) {
//         describe("the tokens' owner is not the contract's owner", function () {
//           it("Contract's owner balance shoud be 0", async function () {
//             expect(await contract.balanceOf(contractOwner.address)).to.equal(0);
//           });
//
//           it("should assign the total supply of tokens to the tokensOwner", async function () {
//             const tokensOwnerBalance = await contract.balanceOf(
//               tokensOwner.address
//             );
//             expect(await contract.totalSupply()).to.equal(tokensOwnerBalance);
//           });
//         });
//       }
//
//       it("should return the correct supply", async function () {
//         await credit(alice.address, tokens(1));
//         expect(await contract.totalSupply()).to.be.equal(
//           options.creditIsMinting ? initialSupply.add(tokens(1)) : initialSupply
//         );
//
//         await credit(alice.address, tokens(2));
//         expect(await contract.totalSupply()).to.be.equal(
//           options.creditIsMinting ? initialSupply.add(tokens(3)) : initialSupply
//         );
//
//         await credit(bob.address, tokens(3));
//         expect(await contract.totalSupply()).to.be.equal(
//           options.creditIsMinting ? initialSupply.add(tokens(6)) : initialSupply
//         );
//       });
//     });
//
//     describe("balanceOf(_owner)", function () {
//       it("should have correct initial balances", async function () {
//         for (let i = 0; i < initialBalances.length; i++) {
//           const address = initialBalances[i][0];
//           const balance = initialBalances[i][1];
//           expect(await contract.balanceOf(address)).to.be.equal(balance);
//         }
//       });
//
//       it("should return the correct balances", async function () {
//         await credit(alice.address, tokens(1));
//         expect(await contract.balanceOf(alice.address)).to.be.equal(tokens(1));
//
//         await credit(alice.address, tokens(2));
//         expect(await contract.balanceOf(alice.address)).to.be.equal(tokens(3));
//
//         await credit(bob.address, tokens(3));
//         expect(await contract.balanceOf(bob.address)).to.be.equal(tokens(3));
//       });
//     });
//
//     describe("allowance(_owner, _spender)", function () {
//       describeIt(when("_owner !==_spender"), alice, bob);
//       describeIt(when("_owner == _spender"), alice, alice);
//
//       it("should have correct initial allowance", async function () {
//         for (let i = 0; i < initialAllowances.length; i++) {
//           const owner = initialAllowances[i][0];
//           const spender = initialAllowances[i][1];
//           const expectedAllowance = initialAllowances[i][1];
//           // FIXME
//           expect(await contract.allowance(owner, spender)).to.be.equal(
//             expectedAllowance
//           );
//         }
//       });
//
//       it("should return the correct allowance", async function () {
//         await contract.connect(alice).approve(bob.address, tokens(1));
//         await contract.connect(alice).approve(charles.address, tokens(2));
//         await contract.connect(bob).approve(charles.address, tokens(3));
//         await contract.connect(bob).approve(alice.address, tokens(4));
//         await contract.connect(charles).approve(alice.address, tokens(5));
//         await contract.connect(charles).approve(bob.address, tokens(6));
//
//         expect(
//           await contract.allowance(alice.address, bob.address)
//         ).to.be.equal(tokens(1));
//         expect(
//           await contract.allowance(alice.address, charles.address)
//         ).to.be.equal(tokens(2));
//         expect(
//           await contract.allowance(bob.address, charles.address)
//         ).to.be.equal(tokens(3));
//         expect(
//           await contract.allowance(bob.address, alice.address)
//         ).to.be.equal(tokens(4));
//         expect(
//           await contract.allowance(charles.address, alice.address)
//         ).to.be.equal(tokens(5));
//         expect(
//           await contract.allowance(charles.address, bob.address)
//         ).to.be.equal(tokens(6));
//       });
//
//       function describeIt(
//         name: string,
//         from: SignerWithAddress,
//         to: SignerWithAddress
//       ) {
//         describe(name, function () {
//           it("should return the correct allowance", async function () {
//             await contract.connect(from).approve(to.address, tokens(1));
//             expect(
//               await contract.allowance(from.address, to.address)
//             ).to.be.equal(tokens(1));
//           });
//         });
//       }
//     });
//
//     // NOTE: assumes that approve should always succeed
//     describe("approve(_spender, _value)", function () {
//       describeIt(when("_spender != sender"), alice, bob);
//       describeIt(when("_spender == sender"), alice, alice);
//
//       function describeIt(
//         name: string,
//         from: SignerWithAddress,
//         to: SignerWithAddress
//       ) {
//         describe(name, function () {
//           it("should not revert when approving 0", async function () {
//             await expect(
//               contract.connect(from).approve(to.address, 0)
//             ).to.be.not.reverted;
//           });
//
//           it("should not revert when approving", async function () {
//             await expect(
//               contract.connect(from).approve(to.address, tokens(3))
//             ).to.be.not.reverted;
//           });
//
//           it("should not revert when updating approval", async function () {
//             assert.isTrue(
//               await contract.connect(from).approve(to.address, tokens(2))
//             );
//             await contract.connect(from).approve(to.address, tokens(2));
//
//             // test decreasing approval
//             assert.isTrue(
//               await contract.connect(from).approve(to.address, tokens(1))
//             );
//
//             // test not-updating approval
//             assert.isTrue(
//               await contract.connect(from).approve(to.address, tokens(2))
//             );
//
//             // test increasing approval
//             assert.isTrue(
//               await contract.connect(from).approve(to.address, tokens(3))
//             );
//           });
//
//           it("should not revert when revoking approval", async function () {
//             await contract.connect(from).approve(to.address, tokens(3));
//             assert.isTrue(
//               await contract.connect(from).approve(to.address, tokens(0))
//             );
//           });
//
//           it("should update allowance accordingly", async function () {
//             await contract.connect(from).approve(to.address, tokens(1));
//             expect(
//               await contract.allowance(from.address, to.address)
//             ).to.be.equal(tokens(1));
//
//             await contract.connect(from).approve(to.address, tokens(3));
//             expect(
//               await contract.allowance(from.address, to.address)
//             ).to.be.equal(tokens(3));
//
//             await contract.connect(from).approve(to.address, 0);
//             expect(
//               await contract.allowance(from.address, to.address)
//             ).to.be.equal("0");
//           });
//
//           it("should fire Approval event", async function () {
//             await testApprovalEvent(from, to, tokens(1));
//             if (from.address !== to.address) {
//               await testApprovalEvent(to, from, tokens(2));
//             }
//           });
//
//           it("should fire Approval when allowance was set to 0", async function () {
//             await contract.connect(from).approve(to.address, tokens(3));
//             await testApprovalEvent(from, to, toBN(0));
//           });
//
//           it("should fire Approval even when allowance did not change", async function () {
//             // even 0 -> 0 should fire Approval event
//             await testApprovalEvent(from, to, toBN(0));
//
//             await contract.connect(from).approve(to.address, tokens(3));
//             await testApprovalEvent(from, to, tokens(3));
//           });
//         });
//       }
//
//       async function testApprovalEvent(
//         from: SignerWithAddress,
//         to: SignerWithAddress,
//         amount: BigNumber
//       ) {
//         await expect(contract.connect(from).approve(to.address, amount))
//           .to.emit(contract, "Approval")
//           .withArgs(from.address, to.address, toBN(amount));
//       }
//     });
//
//     describe("transfer(_to, _value)", function () {
//       describeIt(when("_to !==sender"), alice, bob);
//       describeIt(when("_to == sender"), alice, alice);
//
//       function describeIt(
//         name: string,
//         from: SignerWithAddress,
//         to: SignerWithAddress
//       ) {
//         describe(name, function () {
//           it("should not revert when called with amount of 0", async function () {
//             assert.isTrue(await contract.connect(from).transfer(to.address, 0));
//           });
//
//           it("should not revert when transfer can be made, false otherwise", async function () {
//             await credit(from.address, tokens(3));
//             assert.isTrue(
//               await contract.connect(from).transfer(to.address, tokens(1))
//             );
//             assert.isTrue(
//               await contract.connect(from).transfer(to.address, tokens(2))
//             );
//             assert.isTrue(
//               await contract.connect(from).transfer(to.address, tokens(3))
//             );
//
//             await contract.connect(from).transfer(to.address, tokens(1));
//             assert.isTrue(
//               await contract.connect(from).transfer(to.address, tokens(1))
//             );
//             assert.isTrue(
//               await contract.connect(from).transfer(to.address, tokens(2))
//             );
//           });
//
//           it("should revert when trying to transfer something while having nothing", async function () {
//             await expect(
//               contract.connect(from).transfer(to.address, tokens(1))
//             ).to.be.reverted;
//           });
//
//           it("should revert when trying to transfer more than balance", async function () {
//             await credit(from.address, tokens(3));
//             await expect(
//               contract.connect(from).transfer(to.address, tokens(4))
//             ).to.be.reverted;
//
//             await contract
//               .connect(from)
//               .transfer(
//                 "0x0000000000000000000000000000000000000001",
//                 tokens(1)
//               );
//             await expect(
//               contract.connect(from).transfer(to.address, tokens(3))
//             ).to.be.reverted;
//           });
//
//           it("should not affect totalSupply", async function () {
//             await credit(from.address, tokens(3));
//             const supply1 = await contract.totalSupply();
//             await contract.connect(from).transfer(to.address, tokens(3));
//             const supply2 = await contract.totalSupply();
//             expect(supply2).to.be.equal(supply1);
//           });
//
//           it("should update balances accordingly", async function () {
//             await credit(from.address, tokens(3));
//             const fromBalance1 = await contract.balanceOf(from.address);
//             const toBalance1 = await contract.balanceOf(to.address);
//
//             await contract.connect(from).transfer(to.address, tokens(1));
//             const fromBalance2 = await contract.balanceOf(from.address);
//             const toBalance2 = await contract.balanceOf(to.address);
//
//             if (from.address === to.address) {
//               expect(fromBalance2).to.be.equal(fromBalance1);
//             } else {
//               expect(fromBalance2).to.be.equal(fromBalance1.sub(tokens(1)));
//               expect(toBalance2).to.be.equal(toBalance1.add(tokens(1)));
//             }
//
//             await contract.connect(from).transfer(to.address, tokens(2));
//             const fromBalance3 = await contract.balanceOf(from.address);
//             const toBalance3 = await contract.balanceOf(to.address);
//
//             if (from.address === to.address) {
//               expect(fromBalance3).to.be.equal(fromBalance2);
//             } else {
//               expect(fromBalance3).to.be.equal(fromBalance2.sub(tokens(2)));
//               expect(toBalance3).to.be.equal(toBalance2.add(tokens(2)));
//             }
//           });
//
//           it("should fire Transfer event", async function () {
//             await testTransferEvent(from, to, tokens(3));
//           });
//
//           it("should fire Transfer event when transferring amount of 0", async function () {
//             await testTransferEvent(from, to, toBN(0));
//           });
//         });
//       }
//
//       async function testTransferEvent(
//         from: SignerWithAddress,
//         to: SignerWithAddress,
//         amount: BigNumber
//       ) {
//         if (amount > toBN(0)) {
//           await credit(from.address, amount);
//         }
//
//         await expect(contract.connect(from).transfer(to.address, amount))
//           .to.emit(contract, "Transfer")
//           .withArgs(from.address, to.address, toBN(amount));
//       }
//     });
//
//     describe("transferFrom(_from, _to, _value)", function () {
//       describeIt(when("_from != _to and _to != sender"), alice, bob, charles);
//       describeIt(when("_from != _to and _to == sender"), alice, bob, bob);
//       describeIt(when("_from == _to and _to != sender"), alice, alice, bob);
//       describeIt(when("_from == _to and _to == sender"), alice, alice, alice);
//
//       it("should revert when trying to transfer while not allowed at all", async function () {
//         await credit(alice.address, tokens(3));
//         await expect(
//           contract
//             .connect(bob)
//             .transferFrom(alice.address, bob.address, tokens(1))
//         ).to.be.reverted;
//         await expect(
//           contract
//             .connect(bob)
//             .transferFrom(alice.address, charles.address, tokens(1))
//         ).to.be.reverted;
//       });
//
//       it("should fire Transfer event when transferring amount of 0 and sender is not approved", async function () {
//         await testTransferEvent(alice, bob, bob, 0);
//       });
//
//       function describeIt(
//         name: string,
//         from: SignerWithAddress,
//         via: SignerWithAddress,
//         to: SignerWithAddress
//       ) {
//         describe(name, function () {
//           beforeEach(async function () {
//             // by default approve sender (via) to transfer
//             await contract.connect(from).approve(via.address, tokens(3));
//           });
//
//           it("should not revert when called with amount of 0 and sender is approved", async function () {
//             assert.isTrue(
//               await contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, 0)
//             );
//           });
//
//           it("should not revert when called with amount of 0 and sender is not approved", async function () {
//             assert.isTrue(
//               await contract
//                 .connect(via)
//                 .transferFrom(to.address, from.address, 0)
//             );
//           });
//
//           it("should not revert when transfer can be made, false otherwise", async function () {
//             await credit(from.address, tokens(3));
//             assert.isTrue(
//               await contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, tokens(1))
//             );
//             assert.isTrue(
//               await contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, tokens(2))
//             );
//             assert.isTrue(
//               await contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, tokens(3))
//             );
//
//             await contract
//               .connect(via)
//               .transferFrom(from.address, to.address, tokens(1));
//             assert.isTrue(
//               await contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, tokens(1))
//             );
//             assert.isTrue(
//               await contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, tokens(2))
//             );
//           });
//
//           it("should revert when trying to transfer something while _from having nothing", async function () {
//             await expect(
//               contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, tokens(1))
//             ).to.be.reverted;
//           });
//
//           it("should revert when trying to transfer more than balance of _from", async function () {
//             await credit(from.address, tokens(2));
//             await expect(
//               contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, tokens(3))
//             ).to.be.reverted;
//           });
//
//           it("should revert when trying to transfer more than allowed", async function () {
//             await credit(from.address, tokens(4));
//             await expect(
//               contract
//                 .connect(via)
//                 .transferFrom(from.address, to.address, tokens(4))
//             ).to.be.reverted;
//           });
//
//           it("should not affect totalSupply", async function () {
//             await credit(from.address, tokens(3));
//             const supply1 = await contract.totalSupply();
//             await contract
//               .connect(via)
//               .transferFrom(from.address, to.address, tokens(3));
//             const supply2 = await contract.totalSupply();
//             expect(supply2).to.be.equal(supply1);
//           });
//
//           it("should update balances accordingly", async function () {
//             await credit(from.address, tokens(3));
//             const fromBalance1 = await contract.balanceOf(from.address);
//             const viaBalance1 = await contract.balanceOf(via.address);
//             const toBalance1 = await contract.balanceOf(to.address);
//
//             await contract
//               .connect(via)
//               .transferFrom(from.address, to.address, tokens(1));
//             const fromBalance2 = await contract.balanceOf(from.address);
//             const viaBalance2 = await contract.balanceOf(via.address);
//             const toBalance2 = await contract.balanceOf(to.address);
//
//             if (from.address === to.address) {
//               expect(fromBalance2).to.be.equal(fromBalance1);
//             } else {
//               expect(fromBalance2).to.be.equal(fromBalance1.sub(tokens(1)));
//               expect(toBalance2).to.be.equal(toBalance1.add(tokens(1)));
//             }
//
//             if (via.address !== from.address && via.address !== to.address) {
//               expect(viaBalance2).to.be.equal(viaBalance1);
//             }
//
//             await contract
//               .connect(via)
//               .transferFrom(from.address, to.address, tokens(2));
//             const fromBalance3 = await contract.balanceOf(from.address);
//             const viaBalance3 = await contract.balanceOf(via.address);
//             const toBalance3 = await contract.balanceOf(to.address);
//
//             if (from.address === to.address) {
//               expect(fromBalance3).to.be.equal(fromBalance2);
//             } else {
//               expect(fromBalance3).to.be.equal(fromBalance2.sub(tokens(2)));
//               expect(toBalance3).to.be.equal(toBalance2.add(tokens(2)));
//             }
//
//             if (via.address !== from.address && via.address !== to.address) {
//               expect(viaBalance3).to.be.equal(viaBalance2);
//             }
//           });
//
//           it("should update allowances accordingly", async function () {
//             await credit(from.address, tokens(3));
//             const viaAllowance1 = await contract.allowance(
//               from.address,
//               via.address
//             );
//             const toAllowance1 = await contract.allowance(
//               from.address,
//               to.address
//             );
//
//             await contract
//               .connect(via)
//               .transferFrom(from.address, to.address, tokens(2));
//             const viaAllowance2 = await contract.allowance(
//               from.address,
//               via.address
//             );
//             const toAllowance2 = await contract.allowance(
//               from.address,
//               to.address
//             );
//
//             expect(viaAllowance2).to.be.equal(viaAllowance1.sub(tokens(2)));
//
//             if (to.address !== via.address) {
//               expect(toAllowance2).to.be.equal(toAllowance1);
//             }
//
//             await contract
//               .connect(via)
//               .transferFrom(from.address, to.address, tokens(1));
//             const viaAllowance3 = await contract.allowance(
//               from.address,
//               via.address
//             );
//             const toAllowance3 = await contract.allowance(
//               from.address,
//               to.address
//             );
//
//             expect(viaAllowance3).to.be.equal(viaAllowance2.sub(tokens(1)));
//
//             if (to.address !== via.address) {
//               expect(toAllowance3).to.be.equal(toAllowance1);
//             }
//           });
//
//           it("should fire Transfer event", async function () {
//             await testTransferEvent(from, via, to, tokens(3));
//           });
//
//           it("should fire Transfer event when transferring amount of 0", async function () {
//             await testTransferEvent(from, via, to, 0);
//           });
//         });
//       }
//
//       async function testTransferEvent(
//         from: SignerWithAddress,
//         via: SignerWithAddress,
//         to: SignerWithAddress,
//         amount: number | BigNumber
//       ) {
//         if (amount > toBN(0)) {
//           await credit(from.address, toBN(amount));
//         }
//
//         await expect(
//           contract.connect(via).transferFrom(from.address, to.address, amount)
//         )
//           .to.emit(contract, "Transfer")
//           .withArgs(from.address, to.address, toBN(amount));
//       }
//     });
//   });
//
//   if (options.ercs.erc20?.shouldTestIncreaseDecreaseApproval) {
//     describe("approvals", function () {
//       describe("increaseApproval(_spender, _addedValue)", function () {
//         it("should not revert when increasing approval", async function () {
//           assert.isTrue(
//             await contract.connect(alice).increaseApproval(bob.address, 0)
//           );
//           assert.isTrue(
//             await contract.connect(alice).increaseApproval(bob.address, uintMax)
//           );
//
//           await contract
//             .connect(alice)
//             .increaseApproval(bob.address, tokens(3));
//           assert.isTrue(
//             await contract.connect(alice).increaseApproval(bob.address, 0)
//           );
//           assert.isTrue(
//             await contract
//               .connect(alice)
//               .increaseApproval(bob.address, tokens(3))
//           );
//         });
//
//         it("should revert when approval cannot be increased", async function () {
//           await contract
//             .connect(alice)
//             .increaseApproval(bob.address, tokens(1));
//           await expect(
//             contract.connect(alice).increaseApproval(bob.address, uintMax)
//           ).to.be.reverted;
//         });
//
//         it("should update allowance accordingly", async function () {
//           await contract
//             .connect(alice)
//             .increaseApproval(bob.address, tokens(1));
//           expect(
//             await contract.allowance(alice.address, bob.address)
//           ).to.be.equal(tokens(1));
//
//           await contract
//             .connect(alice)
//             .increaseApproval(bob.address, tokens(2));
//           expect(
//             await contract.allowance(alice.address, bob.address)
//           ).to.be.equal(tokens(3));
//
//           await contract.connect(alice).increaseApproval(bob.address, 0);
//           expect(
//             await contract.allowance(alice.address, bob.address)
//           ).to.be.equal(tokens(3));
//         });
//
//         it("should fire Approval event", async function () {
//           await testApprovalEvent(alice, bob, 0, tokens(1));
//           await testApprovalEvent(alice, bob, tokens(1), tokens(2));
//         });
//
//         it("should fire Approval even when allowance did not change", async function () {
//           await testApprovalEvent(alice, bob, 0, 0);
//
//           await contract
//             .connect(alice)
//             .increaseApproval(bob.address, tokens(3));
//           await testApprovalEvent(alice, bob, tokens(3), 0);
//         });
//
//         async function testApprovalEvent(
//           from: SignerWithAddress,
//           to: SignerWithAddress,
//           fromAmount: number | BigNumber,
//           byAmount: number | BigNumber
//         ) {
//           await expect(
//             contract.connect(from).increaseApproval(to.address, byAmount)
//           )
//             .to.emit(contract, "Approval")
//             .withArgs(from.address, to.address, toBN(fromAmount).add(byAmount));
//         }
//       });
//
//       describe("decreaseApproval(_spender, _subtractedValue)", function () {
//         beforeEach(async function () {
//           await contract.connect(alice).approve(bob.address, tokens(3));
//         });
//
//         it("should not revert when decreasing approval", async function () {
//           assert.isTrue(
//             await contract.connect(alice).decreaseApproval(bob.address, 0)
//           );
//           assert.isTrue(
//             await contract
//               .connect(alice)
//               .decreaseApproval(bob.address, tokens(3))
//           );
//         });
//
//         it("should not revert when approval cannot be decreased", async function () {
//           assert.isTrue(
//             await contract.connect(alice).decreaseApproval(bob.address, uintMax)
//           );
//         });
//
//         it("should update allowance accordingly", async function () {
//           await contract
//             .connect(alice)
//             .decreaseApproval(bob.address, tokens(1));
//           expect(
//             await contract.allowance(alice.address, bob.address)
//           ).to.be.equal(tokens(2));
//
//           await contract
//             .connect(alice)
//             .decreaseApproval(bob.address, tokens(3));
//           expect(
//             await contract.allowance(alice.address, bob.address)
//           ).to.be.equal(0);
//
//           await contract.connect(alice).decreaseApproval(bob.address, 0);
//           expect(
//             await contract.allowance(alice.address, bob.address)
//           ).to.be.equal(0);
//         });
//
//         it("should fire Approval event", async function () {
//           await testApprovalEvent(alice, bob, tokens(3), tokens(1));
//           await testApprovalEvent(alice, bob, tokens(2), tokens(2));
//         });
//
//         it("should fire Approval even when allowance did not change", async function () {
//           await testApprovalEvent(alice, bob, tokens(3), 0);
//
//           await contract.decreaseApproval(bob, tokens(3), {from: alice});
//           await testApprovalEvent(alice, bob, 0, 0);
//         });
//
//         async function testApprovalEvent(
//           from: SignerWithAddress,
//           to: SignerWithAddress,
//           fromAmount: number | BigNumber,
//           byAmount: number | BigNumber
//         ) {
//           await expect(
//             contract.connect(from).decreaseApproval(to.address, byAmount)
//           )
//             .to.emit(contract, "Approval")
//             .withArgs(from.address, to.address, toBN(fromAmount).sub(byAmount));
//         }
//       });
//     });
//   }
// }
//
// function when(name: string): string {
//   return "when (" + name + ")";
// }
