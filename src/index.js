import {spawn} from 'cross-spawn'
import commandConvert from './command'
import varValueConvert from './variable'

module.exports = crossEnv

const envSetterRegex = /(\w+)=('(.+)'|"(.+)"|(.+))/

function crossEnv(args) {
  const [envSetters, command, commandArgs] = parseCommand(args)
  if (command) {
    const proc = spawn(
      commandConvert(command),
      commandArgs.map(commandConvert),
      {
        stdio: 'inherit',
        shell: true,
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
    if (match) {
      envSetters[match[1]] = match[3] || match[4] || match[5]
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
    envVars[varName] = varValueConvert(envSetters[varName])
  })
  return envVars
}
