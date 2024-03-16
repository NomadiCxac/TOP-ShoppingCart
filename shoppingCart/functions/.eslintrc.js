module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {
        "max-len": "off",
        "linebreak-style": "off",
        "require-jsdoc": "off",
        "jsdoc/check-alignment": "off",
        "jsdoc/check-param-names": "off",
        "jsdoc/check-syntax": "off",
        "jsdoc/check-types": "off",
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-param-description": "off",
        "jsdoc/require-param-name": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-returns-check": "off",
        "jsdoc/require-returns-description": "off",
        "jsdoc/require-returns-type": "off",
      },
    },
  ],
  globals: {},
};
