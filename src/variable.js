const isWindows = require('./is-windows')
const envReplace = require('./env-replace')

const pathLikeEnvVarWhitelist = new Set(['PATH', 'NODE_PATH'])

module.exports = varValueConvert

/**
 * This will transform UNIX-style list values to Windows-style.
 * For example, the value of the $PATH variable "/usr/bin:/usr/local/bin:."
 * will become "/usr/bin;/usr/local/bin;." on Windows.
 * @param {String} varValue Original value of the env variable
 * @param {String} varName Original name of the env variable
 * @returns {String} Converted value
 */
function replaceListDelimiters(varValue, varName = '') {
  const targetSeparator = isWindows() ? ';' : ':'
  if (!pathLikeEnvVarWhitelist.has(varName)) {
    return varValue
  }

  return varValue.replace(/(\\*):/g, (match, backslashes) => {
    if (backslashes.length % 2) {
      // Odd number of backslashes preceding it means it's escaped,
      // remove 1 backslash and return the rest as-is
      return match.substr(1)
    }
    return backslashes + targetSeparator
  })
}

/**
 * Converts an environment variable value to be appropriate for the current OS.
 * @param {String} originalValue Original value of the env variable
 * @param {String} originalName Original name of the env variable
 * @returns {String} Converted value
 */
function varValueConvert(originalValue, originalName) {
  return envReplace(replaceListDelimiters(originalValue, originalName))
}
