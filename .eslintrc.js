module.exports = {
  extends: ['standard', 'prettier'],
  rules: {
    'arrow-parens': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'always-multiline'],
    indent: 'off',
    'line-comment-position': ['error', { position: 'above' }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'padded-blocks': 'off',
    'space-before-function-paren': 'off',
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    semi: ['error', 'always'],
    'accessor-pairs': 'off',
  },
  globals: {
    Event: 'readonly',
  },
};
