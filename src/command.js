const path = require('path')
const isWindows = require('./is-windows')
const envReplace = require('./env-replace')

module.exports = commandConvert

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @param {Object} env Map of the current environment variable names and their values
 * @param {boolean} normalize If the command should be normalized using `path`
 * after converting
 * @returns {String} Converted command
 */
function commandConvert(command, env, normalize = false) {
  if (!isWindows()) {
    return command
  }
  const convertedCmd = envReplace(command, env, true)
  // Normalization is required for commands with relative paths
  // For example, `./cmd.bat`. See kentcdodds/cross-env#127
  // However, it should not be done for command arguments.
  // See https://github.com/kentcdodds/cross-env/pull/130#issuecomment-319887970
  return normalize === true ? path.normalize(convertedCmd) : convertedCmd
}
