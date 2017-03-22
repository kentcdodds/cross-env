import isWindows from 'is-windows'

const winSeparator = ';'
const unixSeparator = ':'

/**
 * Converts an environment variable value to be appropriate for the current OS.
 * It will transform UNIX-style list values to Windows-style, and vice-versa.
 * For example, the value of the $PATH variable "/usr/bin:/usr/local/bin:."
 * will become "/usr/bin;/usr/local/bin;." on Windows.
 * @param {String} originalValue Original value of the env variable
 * @returns {String} Converted value
 */
export default function varValueConvert(originalValue) {
  const isWin = isWindows()
  const targetSeparator = isWin ? winSeparator : unixSeparator
  const regexp = new RegExp(`(\\\\*)[${winSeparator}${unixSeparator}]`, 'g')
  return originalValue.replace(regexp, (match, backslashes) => {
    if (backslashes.length % 2) {
      // Odd number of backslashes preceding it means it's escaped,
      // remove 1 backslash and return the rest as-is
      return match.substr(1)
    }
    return backslashes + targetSeparator
  })
}
