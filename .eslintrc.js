module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint", "promise", "prettier"],
  extends: [
    "standard",
    "plugin:node/recommended",
    "plugin:promise/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  settings: {
    node: {
      tryExtensions: [".ts", "js", "json"],
    },
  },
  rules: {
    "node/no-unsupported-features/es-syntax": ["error", {ignores: ["modules"]}],
    "node/no-missing-import": [
      "error",
      {
        allowModules: ["chai"],
        resolvePaths: ["/test/utils"],
        tryExtensions: [".ts", ".json", ".node", ".js"],
      },
    ],
    "node/exports-style": ["error", "module.exports"],
    "node/prefer-global/buffer": ["error", "always"],
    "node/prefer-global/console": ["error", "always"],
    "node/prefer-global/process": ["error", "always"],
    "node/prefer-global/url-search-params": ["error", "always"],
    "node/prefer-global/url": ["error", "always"],
    "node/prefer-promises/dns": "error",
    "node/prefer-promises/fs": "error",
  },
};
