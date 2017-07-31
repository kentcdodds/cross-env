import isWindows from 'platform-is'

export default commandConvert

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @returns {String} Converted command
 */
function commandConvert(command) {
  if (!isWindows()) {
    return command
  }
  const envUnixRegex = /\$(\w+)|\${(\w+)}/g // $my_var or ${my_var}
  return command.replace(envUnixRegex, '%$1$2%')
}
