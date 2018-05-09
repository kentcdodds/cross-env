import crossSpawnMock from 'cross-spawn'
import isWindowsMock from 'is-windows'

const crossEnv = require('../')

process.setMaxListeners(20)

beforeEach(() => {
  crossSpawnMock.__mock.reset()
})

it(`should set environment variables and run the remaining command`, () => {
  testEnvSetting({FOO_ENV: 'production'}, 'FOO_ENV=production')
})

it(`should APPDATA be undefined and not string`, () => {
  testEnvSetting({FOO_ENV: 'production', APPDATA: 2}, 'FOO_ENV=production')
})

it(`should handle multiple env variables`, () => {
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

it(`should handle special characters`, () => {
  testEnvSetting({FOO_ENV: './!?'}, 'FOO_ENV=./!?')
})

it(`should handle single-quoted strings`, () => {
  testEnvSetting({FOO_ENV: 'bar env'}, "FOO_ENV='bar env'")
})

it(`should handle double-quoted strings`, () => {
  testEnvSetting({FOO_ENV: 'bar env'}, 'FOO_ENV="bar env"')
})

it(`should handle equality signs in quoted strings`, () => {
  testEnvSetting({FOO_ENV: 'foo=bar'}, 'FOO_ENV="foo=bar"')
})

it(`should handle empty single-quoted strings`, () => {
  testEnvSetting({FOO_ENV: ''}, "FOO_ENV=''")
})

it(`should handle empty double-quoted strings`, () => {
  testEnvSetting({FOO_ENV: ''}, 'FOO_ENV=""')
})

it(`should handle no value after the equals sign`, () => {
  testEnvSetting({FOO_ENV: ''}, 'FOO_ENV=')
})

it(`should handle quoted scripts`, () => {
  crossEnv(['GREETING=Hi', 'NAME=Joe', 'echo $GREETING && echo $NAME'], {
    shell: true,
  })
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith(
    'echo $GREETING && echo $NAME',
    [],
    {
      stdio: 'inherit',
      shell: true,
      env: Object.assign({}, process.env, {
        GREETING: 'Hi',
        NAME: 'Joe',
      }),
    },
  )
})

it(`should handle escaped characters`, () => {
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
      env: Object.assign({}, process.env, {
        GREETING: 'Hi',
        NAME: 'Joe',
      }),
    },
  )
})

it(`should do nothing given no command`, () => {
  crossEnv([])
  expect(crossSpawnMock.spawn).toHaveBeenCalledTimes(0)
})

it(`should normalize command on windows`, () => {
  isWindowsMock.__mock.returnValue = true
  crossEnv(['./cmd.bat'])
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith('cmd.bat', [], {
    stdio: 'inherit',
    env: Object.assign({}, process.env),
  })
  isWindowsMock.__mock.reset()
})

it(`should not normalize command arguments on windows`, () => {
  isWindowsMock.__mock.returnValue = true
  crossEnv(['echo', 'http://example.com'])
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith(
    'echo',
    ['http://example.com'],
    {
      stdio: 'inherit',
      env: Object.assign({}, process.env),
    },
  )
  isWindowsMock.__mock.reset()
})

it(`should propagate kill signals`, () => {
  testEnvSetting({FOO_ENV: 'foo=bar'}, 'FOO_ENV="foo=bar"')

  process.emit('SIGTERM')
  process.emit('SIGINT')
  process.emit('SIGHUP')
  process.emit('SIGBREAK')
  expect(crossSpawnMock.__mock.spawned.kill).toHaveBeenCalledWith('SIGTERM')
  expect(crossSpawnMock.__mock.spawned.kill).toHaveBeenCalledWith('SIGINT')
  expect(crossSpawnMock.__mock.spawned.kill).toHaveBeenCalledWith('SIGHUP')
  expect(crossSpawnMock.__mock.spawned.kill).toHaveBeenCalledWith('SIGBREAK')
})

it(`should propagate unhandled exit signal`, () => {
  process.exit = jest.fn()
  testEnvSetting({FOO_ENV: 'foo=bar'}, 'FOO_ENV="foo=bar"')
  const spawnExitCallback = crossSpawnMock.__mock.spawned.on.mock.calls[0][1]
  const spawnExitCode = null
  spawnExitCallback(spawnExitCode)
  expect(process.exit).toHaveBeenCalledWith(1)
})

it(`should propagate regular exit code`, () => {
  process.exit = jest.fn()
  testEnvSetting({FOO_ENV: 'foo=bar'}, 'FOO_ENV="foo=bar"')
  const spawnExitCallback = crossSpawnMock.__mock.spawned.on.mock.calls[0][1]
  const spawnExitCode = 0
  spawnExitCallback(spawnExitCode)
  expect(process.exit).toHaveBeenCalledWith(0)
})

it(`should keep backslashes`, () => {
  isWindowsMock.__mock.returnValue = true
  crossEnv(['echo', '\\\\\\\\someshare\\\\somefolder'])
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith(
    'echo',
    ['\\\\someshare\\somefolder'],
    {
      stdio: 'inherit',
      env: Object.assign({}, process.env),
    },
  )
  isWindowsMock.__mock.reset()
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
  expect(ret).toBe(crossSpawnMock.__mock.spawned)
  expect(crossSpawnMock.spawn).toHaveBeenCalledTimes(1)
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith('echo', ['hello world'], {
    stdio: 'inherit',
    shell: undefined,
    env: Object.assign({}, process.env, env),
  })

  expect(crossSpawnMock.__mock.spawned.on).toHaveBeenCalledTimes(1)
  expect(crossSpawnMock.__mock.spawned.on).toHaveBeenCalledWith(
    'exit',
    expect.any(Function),
  )
}
