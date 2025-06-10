module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    // Client: React + TypeScript
    {
      files: ['client/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'no-redeclare': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },

    // Server: plain JavaScript
    {
      files: ['server/**/*.js'],
      parser: 'espree',
      extends: ['eslint:recommended', 'prettier'],
      env: {
        node: true,
      },
      rules: {
        'no-unused-vars': 'warn',
        'no-undef': 'off',
        'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      },
    },
  ],
};
