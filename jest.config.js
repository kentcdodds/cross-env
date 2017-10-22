const jestConfig = require('kcd-scripts/config').jest

jestConfig.coveragePathIgnorePatterns = jestConfig.coveragePathIgnorePatterns.concat(
  ['/bin/']
)
module.exports = jestConfig
