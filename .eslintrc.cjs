module.exports = {
  overrides: [
    {
      env: {
        browser: true,
        es2021: true
      },
      extends: ['love'],
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/space-before-function-paren': 'off'
      }
    },
    {
      env: {
        node: true
      },
      files: ['vite.config.ts', './packages/bot/cp.js'],
      parserOptions: {
        sourceType: 'script',
        project: false
      }
    }
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './*/tsconfig.json']
  }
}
