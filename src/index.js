const {spawn} = require('cross-spawn')
const commandConvert = require('./command')
const varValueConvert = require('./variable')

module.exports = crossEnv

const envSetterRegex = /(\w+)=('(.*)'|"(.*)"|(.*))/

function crossEnv(args, options = {}) {
  const [envSetters, command, commandArgs] = parseCommand(args)
  const env = getEnvVars(envSetters)
  if (command) {
    let child = spawn(
      // run `path.normalize` for command(on windows)
      commandConvert(command, env, true),
      // by default normalize is `false`, so not run for cmd args
      commandArgs.map(arg => commandConvert(arg, env)),
      {
        stdio: 'inherit',
        shell: options.shell,
        env,
      },
    )

    // See https://github.com/jtlapp/node-cleanup
    //
    // > When you hit Ctrl-C, you send a SIGINT signal to each process in the
    // > current process group. A process group is set of processes that are
    // > all supposed to end together as a group instead of persisting
    // > independently. However, some programs, such as Emacs, intercept and
    // > repurpose SIGINT so that it does not end the process. In such cases,
    // > SIGINT should not end any processes of the group.
    //
    // Delegate decision to terminate to child process, if the child exits on
    // SIGINT then the `child.on('exit')` callback will be invoked, re-raising
    // the signal to the parent process
    const delegateSignalToChild = signal => () => {
      // SIGINT is sent to all processes in group, no need to delegate.
      if (child && signal !== 'SIGINT') {
        process.kill(child.pid, signal)
      }
    }

    const sigtermHandler = delegateSignalToChild('SIGTERM')
    const sigintHandler = delegateSignalToChild('SIGINT')
    const sigbreakHandler = delegateSignalToChild('SIGBREAK')
    const sighupHandler = delegateSignalToChild('SIGHUP')
    const sigquitHandler = delegateSignalToChild('SIGQUIT')

    process.on('SIGTERM', sigtermHandler)
    process.on('SIGINT', sigintHandler)
    process.on('SIGBREAK', sigbreakHandler)
    process.on('SIGHUP', sighupHandler)
    process.on('SIGQUIT', sigquitHandler)

    child.on('exit', (exitCode, signal) => {
      // Child has decided to exit.
      child = null
      process.removeListener('SIGTERM', sigtermHandler)
      process.removeListener('SIGINT', sigintHandler)
      process.removeListener('SIGBREAK', sigbreakHandler)
      process.removeListener('SIGHUP', sighupHandler)
      process.removeListener('SIGQUIT', sigquitHandler)

      if (exitCode !== null) {
        // Calling process.exit is not necessary most of the time,
        // see https://nodejs.org/api/process.html#process_process_exit_code
        process.exitCode = exitCode
      }
      if (signal !== null) {
        // Pass through child's signal to parent.
        // SIGINT should not be transformed into a 0 exit code
        process.kill(process.pid, signal)
      }
    })
    return child
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
      let value

      if (typeof match[3] !== 'undefined') {
        value = match[3]
      } else if (typeof match[4] === 'undefined') {
        value = match[5]
      } else {
        value = match[4]
      }

      envSetters[match[1]] = value
    } else {
      // No more env setters, the rest of the line must be the command and args
      let cStart = []
      cStart = args
        .slice(i)
        // Regex:
        // match "\'" or "'"
        // or match "\" if followed by [$"\] (lookahead)
        .map(a => {
          const re = /\\\\|(\\)?'|([\\])(?=[$"\\])/g
          // Eliminate all matches except for "\'" => "'"
          return a.replace(re, m => {
            if (m === '\\\\') return '\\'
            if (m === "\\'") return "'"
            return ''
          })
        })
      command = cStart[0]
      commandArgs = cStart.slice(1)
      break
    }
  }

  return [envSetters, command, commandArgs]
}

function getEnvVars(envSetters) {
  const envVars = {...process.env}
  if (process.env.APPDATA) {
    envVars.APPDATA = process.env.APPDATA
  }
  Object.keys(envSetters).forEach(varName => {
    envVars[varName] = varValueConvert(envSetters[varName], varName)
  })
  return envVars
}
