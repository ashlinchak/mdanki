const testPathIgnorePatterns = [
  '/node_modules/',
];

module.exports = {
  testPathIgnorePatterns,
  coverageDirectory : './coverage/',
  testEnvironment   : 'node',
  coverageThreshold : {
    global: {
      branches  : 100,
      functions : 100,
      lines     : 100,
      statements: 100,
    },
  },
};
