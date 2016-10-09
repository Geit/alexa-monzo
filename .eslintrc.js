module.exports = {
    "extends": "standard",
    "installedESLint": true,
    "plugins": [
        "standard",
        "promise"
    ],
    "rules" : {
      semi: ["error", "always"],
      curly: ["error", "multi-or-nest", "consistent"],
      "valid-jsdoc": ["warn"],
      "block-scoped-var": "error",
      "no-var" : "warn",
      "prefer-const" : "warn",
      "prefer-template" : "warn",
      "prefer-arrow-callback" : "warn",
      "object-shorthand" : "error"
  }
};
