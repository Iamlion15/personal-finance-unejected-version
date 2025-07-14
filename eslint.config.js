const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      "no-unused-vars": "warn", // Change from "error" to "warn" (doesn't auto-delete)
      "unused-imports/no-unused-imports": "off", // Disable auto-removal
    },
  },
]);