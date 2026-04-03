module.exports = {
  extends: "stylelint-config-standard",
  rules: {
    "no-descending-specificity": null,
    "declaration-no-important": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["layer", "apply", "responsive", "screen", "variants"],
      },
    ],
    "function-name-case": null,
    "no-invalid-position-at-import-rule": null,
    "selector-class-pattern": null,
    "property-no-unknown": null,
  },
  ignoreFiles: [
    "node_modules/**",
    "dist/**",
    "build/**",
    ".next/**",
    "**/*.js",
    "**/*.jsx",
    "**/*.ts",
    "**/*.tsx",
  ],
};
