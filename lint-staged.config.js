module.exports = {
  '*.{js,jsx,ts,tsx,md,mdx}': [
    // NOTE: 此处 eslint 默认不会使用 .eslintignore 文件，所以需要手动指定
    // 'eslint --fix --ignore-path .eslintignore'
  ],
  '**/*.ts?(x)': () => 'npm run types:check',
  '*.{json,yaml}': ['prettier --write']
}
