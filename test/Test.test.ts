import {expect} from "chai";
import {deployments} from "hardhat";

describe("Test", function () {
  it("test", async function () {
    await deployments.fixture(["Test"]);
    const test = await ethers.getContract("Test");

    expect(await test.getVariable()).to.be.equal(100);
  });
});
