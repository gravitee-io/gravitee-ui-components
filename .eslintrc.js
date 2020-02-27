module.exports = {
  'extends': 'standard',
  'rules': {
    'arrow-parens': ['error', 'always'],
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', 'always-multiline'],
    'import/extensions': ['error', 'always', {'js': 'never'}],
    'line-comment-position': ['error', {'position': 'above'}],
    'no-console': ['error',  { 'allow': ['warn', 'error'] }],
    'operator-linebreak': ['error', 'before'],
    'padded-blocks': 'off',
    'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
    'semi': ['error', 'always'],
  },
  globals: {
    'Event': 'readonly'
  }
};
