import crossSpawnMock from 'cross-spawn'

const crossEnv = require('.')

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

it(`should handle quoted scripts`, () => {
  crossEnv(['GREETING=Hi', 'NAME=Joe', 'echo $GREETING && echo $NAME'])
  expect(
    crossSpawnMock.spawn,
  ).toHaveBeenCalledWith('echo $GREETING && echo $NAME', [], {
    stdio: 'inherit',
    shell: true,
    env: Object.assign({}, process.env, {
      GREETING: 'Hi',
      NAME: 'Joe',
    }),
  })
})

it(`should do nothing given no command`, () => {
  crossEnv([])
  expect(crossSpawnMock.spawn).toHaveBeenCalledTimes(0)
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

function testEnvSetting(expected, ...envSettings) {
  if (expected.APPDATA === 2) {
    // kill the APPDATA to test both is undefined
    delete process.env.APPDATA
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
  expect(ret, 'returns what spawn returns').toBe(crossSpawnMock.__mock.spawned)
  expect(crossSpawnMock.spawn).toHaveBeenCalledTimes(1)
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith('echo', ['hello world'], {
    stdio: 'inherit',
    shell: true,
    env: Object.assign({}, process.env, env),
  })

  expect(crossSpawnMock.__mock.spawned.on).toHaveBeenCalledTimes(1)
  expect(crossSpawnMock.__mock.spawned.on).toHaveBeenCalledWith(
    'exit',
    expect.any(Function),
  )
}
