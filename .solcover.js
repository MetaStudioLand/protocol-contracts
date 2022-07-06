module.exports = {
  norpc: true,
  testCommand: "yarn run hardhat test",
  compileCommand: "yarn run hardhat compile",
  skipFiles: ["mocks"],
  providerOptions: {
    default_balance_ether: "5000000000000000000000000000",
  },
  mocha: {
    // fgrep: "[skip-on-coverage]",
    invert: true,
  },
  istanbulReporter: ["html", "json"],
};
