export default commandConvert;

const envSetterRegex = /(\w+)=('(.+)'|"(.+)"|(.+))/;
const envUseUnixRegex = /\$(\w+)/g; // $my_var
const envUseWinRegex = /\%(.*?)\%/g; // %my_var%
const isWin = process.platform === 'win32';
const envExtract = isWin ? envUseUnixRegex : envUseWinRegex;
const envHasVars = /%|\$/;
const pathSeparator = isWin ? ';' : ':';

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @returns {String} Converted command
 */
function commandConvert(command) {
  const setterMatch = envSetterRegex.exec(command);
  if (setterMatch && envHasVars.test(command)) {
    return setterMatch[1] + '=' + expandEnvironmentVariables(setterMatch[2]);
  }
  const match = envExtract.exec(command);
  if (match) {
    command = isWin ? `%${match[1]}%` : `$${match[1]}`;
  }
  return command;
}

function expandEnvironmentVariables(value) {

  value = convertPathSeparators(value);
  let finalValue = value;
  let envVar;
  while ((envVar = envExtract.exec(value)) !== null) {
    const key = envVar[1];
    const fullKey = isWin ? `%${key}%` : `$${key}`;
    const val = process.env[key] ? process.env[key] : fullKey;
    finalValue = finalValue.replace(envVar[0], val);
  }
  return finalValue;
}

function convertPathSeparators(paths) {

  if (paths.indexOf(pathSeparator) === -1) {
    // doesn't have valid path separators
    if (isWin) {
      paths = paths.replace(':', ';');
    } else {
      paths = paths.replace(';', ':');
    }
  }
  return paths;
}
