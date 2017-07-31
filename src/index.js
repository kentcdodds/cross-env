import {spawn} from 'cross-spawn'
import commandConvert from './command'
import varValueConvert from './variable'
import * as utils from './utils'

module.exports = crossEnv

const envSetterRegex = /(\w+)=('(.*)'|"(.*)"|(.*))/
const crossEnvOption = /--c-only-(\w+)/

function crossEnv(args, options = {}) {
  const [envSetters, command, commandArgs] = parseCommand(args)
  if (command) {
    const proc = spawn(
      commandConvert(command),
      commandArgs.map(commandConvert),
      {
        stdio: 'inherit',
        shell: options.shell,
        env: getEnvVars(envSetters),
      },
    )
    process.on('SIGTERM', () => proc.kill('SIGTERM'))
    process.on('SIGINT', () => proc.kill('SIGINT'))
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'))
    process.on('SIGHUP', () => proc.kill('SIGHUP'))
    proc.on('exit', process.exit)
    return proc
  }
  return null
}

function parseCommand(args) {
  const envSetters = {}
  let command = null
  let commandArgs = []
  for (let i = 0; i < args.length; i++) {
    const match = envSetterRegex.exec(args[i])
    const opt = crossEnvOption.exec(args[i])
    if (match) {
      let value

      if (typeof match[3] !== 'undefined') {
        value = match[3]
      } else if (typeof match[4] === 'undefined') {
        value = match[5]
      } else {
        value = match[4]
      }

      envSetters[match[1]] = value
    } else if (opt) {
      // utils
      if (opt[1] === 'windows' && !utils.isWindows()) {
        break
      }
      if (opt[1] === 'mac' && !utils.isMac()) {
        break
      }
      if (opt[1] === 'linux' && !utils.isLinux()) {
        break
      }
    } else {
      // No more env setters, the rest of the line must be the command and args
      command = args[i]
      commandArgs = args.slice(i + 1)
      break
    }
  }

  return [envSetters, command, commandArgs]
}

function getEnvVars(envSetters) {
  const envVars = Object.assign({}, process.env)
  if (process.env.APPDATA) {
    envVars.APPDATA = process.env.APPDATA
  }
  Object.keys(envSetters).forEach(varName => {
    envVars[varName] = varValueConvert(envSetters[varName], varName)
  })
  return envVars
}
