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
        // Allow commonjs requires
        'no-undef': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
