module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: ['src/lib/mediapipe/**/*.ts', 'src/hooks/usePosture.ts'],
      rules: {
        'no-restricted-globals': [
          'error',
          {
            name: 'fetch',
            message: 'Network requests are strictly prohibited in the tracking and MediaPipe modules for privacy.'
          },
          {
            name: 'XMLHttpRequest',
            message: 'Network requests are strictly prohibited in the tracking and MediaPipe modules for privacy.'
          }
        ]
      }
    }
  ]
}
