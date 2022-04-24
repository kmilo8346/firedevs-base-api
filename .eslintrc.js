module.exports = {
  root: true,
  ignorePatterns: ['dist/**', 'build/**','config/**'],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  rules: {
    quotes: [1, 'single'],
    'no-console': 'off',
    'max-len': 'off',
    camelcase: 'off',
    'space-before-function-paren': 'off',
    'function-paren-newline': 'off',
    'array-element-newline': 'off',
    'object-curly-spacing': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'arrow-parens': [2, 'always']
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
};
