/** @type {import('prettier').Config} */
module.exports = {
  useTabs: false,
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindPreserveWhitespace: true,
};
