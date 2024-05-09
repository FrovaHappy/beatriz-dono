module.exports = {
  overrides: [
    {
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
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
        '@typescript-eslint/space-before-function-paren': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/prefer-promise-reject-errors': 'off',
        '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false
          }
        ]
      }
    },
    {
      env: {
        node: true,
        es6: true
      },
      files: ['vite.config.ts', './packages/bot/cp.cjs'],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 'latest',
        project: false
      }
    }
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './*/tsconfig.json']
  }
}
