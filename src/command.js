import isWindows from 'is-windows'

export default commandConvert

const envUseUnixRegex = /\$(\w+)/g // $my_var
const envUseWinRegex = /%(.*?)%/g // %my_var%

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @returns {String} Converted command
 */
function commandConvert(command) {
  const isWin = isWindows()
  const envExtract = isWin ? envUseUnixRegex : envUseWinRegex
  const match = envExtract.exec(command)
  if (match) {
    command = isWin ? `%${match[1]}%` : `$${match[1]}`
  }
  return command
}
