require('@rushstack/eslint-patch/modern-module-resolution');

const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '/Users/maxpatiiuk/site/git/dotfiles/npm/eslintrc-react/.eslintrc',
  ],
  rules: {
    'no-console': OFF,
  },
};
