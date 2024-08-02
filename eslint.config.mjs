import globals from 'globals'
import parser from '@typescript-eslint/parser'
import plugin from '@typescript-eslint/eslint-plugin'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: [
      'src/**/*.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      plugin,
    },
    rules: {
      complexity: [
        'error',
        5,
      ],
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
        },
      ],
      'linebreak-style': [
        'error',
        'unix',
      ],
      'no-control-regex': 'off',
      'no-namespace': 'off',
      'no-unused-vars': [
        'warn',
        {
          'argsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_',
          'destructuredArrayIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
        },
      ],
      quotes: [
        'error',
        'single',
      ],
      semi: [
        'error',
        'never',
      ],
    }
  }
]
