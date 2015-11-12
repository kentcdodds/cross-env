import {spawn} from 'cross-spawn-async';
import getPathVar from 'manage-path/dist/get-path-var';
export default crossEnv;

const envSetterRegex = /(\w+)=(\w+)/;

function crossEnv(args) {
  const [command, commandArgs, env] = getCommandArgsAndEnvVars(args);
  if (command) {
    return spawn(command, commandArgs, {stdio: 'inherit', env});
  }
}

function getCommandArgsAndEnvVars(args) {
  let command;
  const envVars = {[getPathVar()]: process.env[getPathVar()]};
  const commandArgs = args.slice();
  while (commandArgs.length) {
    const shifted = commandArgs.shift();
    const match = envSetterRegex.exec(shifted);
    if (match) {
      envVars[match[1]] = match[2];
    } else {
      command = shifted;
      break;
    }
    /* istanbul ignore else  */
    if (process.platform === 'win32') {
      envVars.APPDATA = process.env.APPDATA;
    }
  }
  return [command, commandArgs, envVars];
}
