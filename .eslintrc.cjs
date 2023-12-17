/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  ignorePatterns: [
    'node_modules/',
    '**/node_modules/',
    '/**/node_modules/*',
    'out/',
    'dist/',
    'build/',
  ],
  rules: {
    quotes: ["error", "single"],
    '@stylistic/ts/indent': ['error', 2],
    '@stylistic/ts/quotes': ['error', 'single'],
    "semi": "off",
    "@typescript-eslint/semi": ['error', 'never'],
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
  },
  plugins: [
    '@typescript-eslint',
    '@stylistic/ts',
  ],
}
