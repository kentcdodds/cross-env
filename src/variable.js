import isWindows from 'is-windows'

/**
 * Converts an environment variable value to be appropriate for the current OS.
 * It will transform UNIX-style list values to Windows-style.
 * For example, the value of the $PATH variable "/usr/bin:/usr/local/bin:."
 * will become "/usr/bin;/usr/local/bin;." on Windows.
 * @param {String} originalValue Original value of the env variable
 * @returns {String} Converted value
 */
export default function varValueConvert(originalValue) {
  const targetSeparator = isWindows() ? ';' : ':'
  return originalValue.replace(/(\\*):/g, (match, backslashes) => {
    if (backslashes.length % 2) {
      // Odd number of backslashes preceding it means it's escaped,
      // remove 1 backslash and return the rest as-is
      return match.substr(1)
    }
    return backslashes + targetSeparator
  })
}
