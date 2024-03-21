module.exports = {
  '*.{js,jsx,ts,tsx,md,mdx}': ['eslint --fix', 'eslint'],
  '**/*.ts?(x)': () => 'npm run check-types',
  '*.{json,yaml}': ['prettier --write']
}
