module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  rules: {
    'scss/dollar-variable-pattern': '^[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
    'selector-class-pattern': null,
    'max-nesting-depth': 10,
    'selector-max-compound-selectors': 15,
    'property-no-vendor-prefix': null,
    'selector-no-qualifying-type': null,
    'selector-max-id': null,
    'declaration-property-value-disallowed-list': null,
  },
};
