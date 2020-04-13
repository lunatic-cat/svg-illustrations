module.exports = {
  roots: ['<rootDir>'],
  verbose: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
  transform: { '\\.js$': ['babel-jest', { rootMode: 'upward' }] },
};
