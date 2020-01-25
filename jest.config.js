const jest = require('kcd-scripts/jest')

module.exports = {
  ...jest,
  coveragePathIgnorePatterns: [...jest.coveragePathIgnorePatterns, '/bin/'],
}
