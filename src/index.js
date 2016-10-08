import {spawn} from 'cross-spawn';
import commandConvert from './command';
export default crossEnv;

const envSetterRegex = /(\w+)=('(.+)'|"(.+)"|(.+))/;

function crossEnv(args) {
  const [command, commandArgs, env] = getCommandArgsAndEnvVars(args);
  if (command) {
    const proc = spawn(command, commandArgs, {stdio: 'inherit', env});
    process.on('SIGTERM', () => proc.kill('SIGTERM'));
    process.on('SIGINT', () => proc.kill('SIGINT'));
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'));
    process.on('SIGHUP', () => proc.kill('SIGHUP'));
    proc.on('exit', process.exit);
    return proc;
  }
}

function getCommandArgsAndEnvVars(args) { // eslint-disable-line
  let command;
  const envVars = Object.assign({}, process.env);
  const commandArgs = args.map(commandConvert);
  while (commandArgs.length) {
    const shifted = commandArgs.shift();
    const match = envSetterRegex.exec(shifted);
    if (match) {
      envVars[match[1]] = match[3] || match[4] || match[5];
    } else {
      command = shifted;
      break;
    }
    if (process.env.APPDATA) {
      envVars.APPDATA = process.env.APPDATA;
    }
  }
  return [command, commandArgs, envVars];
}
