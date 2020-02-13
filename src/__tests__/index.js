const crossSpawnMock = require('cross-spawn')
const isWindowsMock = require('../is-windows')

jest.mock('../is-windows')
jest.mock('cross-spawn')

const crossEnv = require('../')

/*
  Each test should spawn at most once.
 */
const getSpawned = () => {
  if (crossSpawnMock.spawn.mock.results.length !== 0) {
    return crossSpawnMock.spawn.mock.results[0].value
  }

  return undefined
}

const getSpawnedOnExitCallBack = () => getSpawned().on.mock.calls[0][1]

// Enforce checks for leaking process.on() listeners in cross-env
process.setMaxListeners(1)

beforeEach(() => {
  jest.spyOn(process, 'exit').mockImplementation(() => {})
  jest.spyOn(process, 'kill').mockImplementation(() => {})
  crossSpawnMock.spawn.mockReturnValue({
    pid: 42,
    on: jest.fn(),
    kill: jest.fn(),
  })
})

afterEach(() => {
  // stop tests from leaking process.on() listeners in cross-env
  const spawned = getSpawned()
  if (spawned) {
    const spawnExitCallback = getSpawnedOnExitCallBack()
    const signal = 'SIGTEST'
    const exitCode = null
    spawnExitCallback(exitCode, signal)

    process.removeAllListeners('exit')
  }

  jest.clearAllMocks()
  process.exit.mockRestore()
})

test(`sets environment variables and run the remaining command`, () => {
  testEnvSetting({FOO_ENV: 'production'}, 'FOO_ENV=production')
})

test(`APPDATA is undefined and not string`, () => {
  testEnvSetting({FOO_ENV: 'production', APPDATA: 2}, 'FOO_ENV=production')
})

test(`handles multiple env variables`, () => {
  testEnvSetting(
    {
      FOO_ENV: 'production',
      BAR_ENV: 'dev',
      APPDATA: '0',
    },
    'FOO_ENV=production',
    'BAR_ENV=dev',
    'APPDATA=0',
  )
})

test(`handles special characters`, () => {
  testEnvSetting({FOO_ENV: './!?'}, 'FOO_ENV=./!?')
})

test(`handles single-quoted strings`, () => {
  testEnvSetting({FOO_ENV: 'bar env'}, "FOO_ENV='bar env'")
})

test(`handles double-quoted strings`, () => {
  testEnvSetting({FOO_ENV: 'bar env'}, 'FOO_ENV="bar env"')
})

test(`handles equality signs in quoted strings`, () => {
  testEnvSetting({FOO_ENV: 'foo=bar'}, 'FOO_ENV="foo=bar"')
})

test(`handles empty single-quoted strings`, () => {
  testEnvSetting({FOO_ENV: ''}, "FOO_ENV=''")
})

test(`handles empty double-quoted strings`, () => {
  testEnvSetting({FOO_ENV: ''}, 'FOO_ENV=""')
})

test(`handles no value after the equals sign`, () => {
  testEnvSetting({FOO_ENV: ''}, 'FOO_ENV=')
})

test(`handles quoted scripts`, () => {
  crossEnv(['GREETING=Hi', 'NAME=Joe', 'echo $GREETING && echo $NAME'], {
    shell: true,
  })
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith(
    'echo $GREETING && echo $NAME',
    [],
    {
      stdio: 'inherit',
      shell: true,
      env: {...process.env, GREETING: 'Hi', NAME: 'Joe'},
    },
  )
})

test(`handles escaped characters`, () => {
  // this escapes \,",' and $
  crossEnv(
    ['GREETING=Hi', 'NAME=Joe', 'echo \\"\\\'\\$GREETING\\\'\\" && echo $NAME'],
    {
      shell: true,
    },
  )
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith(
    'echo "\'$GREETING\'" && echo $NAME',
    [],
    {
      stdio: 'inherit',
      shell: true,
      env: {...process.env, GREETING: 'Hi', NAME: 'Joe'},
    },
  )
})

test(`does nothing when given no command`, () => {
  crossEnv([])
  expect(crossSpawnMock.spawn).toHaveBeenCalledTimes(0)
})

test(`normalizes commands on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  crossEnv(['./cmd.bat'])
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith('cmd.bat', [], {
    stdio: 'inherit',
    env: {...process.env},
  })
})

test(`does not normalize command arguments on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  crossEnv(['echo', 'http://example.com'])
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith(
    'echo',
    ['http://example.com'],
    {
      stdio: 'inherit',
      env: {...process.env},
    },
  )
})

test(`keeps backslashes`, () => {
  isWindowsMock.mockReturnValue(true)
  crossEnv(['echo', '\\\\\\\\someshare\\\\somefolder'])
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith(
    'echo',
    ['\\\\someshare\\somefolder'],
    {
      stdio: 'inherit',
      env: {...process.env},
    },
  )
})

describe(`cross-env delegates signals to spawn`, () => {
  test(`SIGINT is not delegated`, () => {
    const signal = 'SIGINT'

    crossEnv(['echo', 'hello world'])
    const spawnExitCallback = getSpawnedOnExitCallBack()
    const exitCode = null
    const parentProcessId = expect.any(Number)

    // Parent receives signal
    // SIGINT is sent to all processes in group, no need to delegated.
    process.emit(signal)
    expect(process.kill).not.toHaveBeenCalled()
    // child handles signal and 'exits'
    spawnExitCallback(exitCode, signal)
    expect(process.kill).toHaveBeenCalledTimes(1)
    expect(process.kill).toHaveBeenCalledWith(parentProcessId, signal)
  })

  test.each(['SIGTERM', 'SIGBREAK', 'SIGHUP', 'SIGQUIT'])(
    `delegates %s`,
    signal => {
      crossEnv(['echo', 'hello world'])
      const spawnExitCallback = getSpawnedOnExitCallBack()
      const exitCode = null
      const parentProcessId = expect.any(Number)

      // Parent receives signal
      process.emit(signal)
      expect(process.kill).toHaveBeenCalledTimes(1)
      expect(process.kill).toHaveBeenCalledWith(42, signal)
      // Parent delegates signal to child, child handles signal and 'exits'
      spawnExitCallback(exitCode, signal)
      expect(process.kill).toHaveBeenCalledTimes(2)
      expect(process.kill).toHaveBeenCalledWith(parentProcessId, signal)
    },
  )
})

describe(`spawn received signal and exits`, () => {
  test.each(['SIGTERM', 'SIGINT', 'SIGBREAK', 'SIGHUP', 'SIGQUIT'])(
    `delegates %s`,
    signal => {
      crossEnv(['echo', 'hello world'])

      const spawnExitCallback = getSpawnedOnExitCallBack()
      const exitCode = null
      const parentProcessId = expect.any(Number)

      // cross-env child.on('exit') re-raises signal, now with no signal handlers
      spawnExitCallback(exitCode, signal)
      process.emit('exit', exitCode, signal)
      expect(process.kill).toHaveBeenCalledTimes(1)
      expect(process.kill).toHaveBeenCalledWith(parentProcessId, signal)
    },
  )
})

test(`spawn regular exit code`, () => {
  crossEnv(['echo', 'hello world'])

  const spawnExitCallback = getSpawnedOnExitCallBack()
  const spawnExitCode = 0
  const spawnExitSignal = null
  spawnExitCallback(spawnExitCode, spawnExitSignal)
  expect(process.exit).not.toHaveBeenCalled()
  expect(process.exitCode).toBe(0)
})

function testEnvSetting(expected, ...envSettings) {
  if (expected.APPDATA === 2) {
    // kill the APPDATA to test both is undefined
    const {env} = process
    delete env.APPDATA
    delete expected.APPDATA
  } else if (!process.env.APPDATA && expected.APPDATA === '0') {
    // set APPDATA and test it
    process.env.APPDATA = '0'
  }
  const ret = crossEnv([...envSettings, 'echo', 'hello world'])
  const env = {}
  if (process.env.APPDATA) {
    env.APPDATA = process.env.APPDATA
  }
  Object.assign(env, expected)
  const spawned = getSpawned()
  expect(ret).toBe(spawned)
  expect(crossSpawnMock.spawn).toHaveBeenCalledTimes(1)
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith('echo', ['hello world'], {
    stdio: 'inherit',
    shell: undefined,
    env: {...process.env, ...env},
  })

  expect(spawned.on).toHaveBeenCalledTimes(1)
  expect(spawned.on).toHaveBeenCalledWith('exit', expect.any(Function))
  return {spawned}
}
