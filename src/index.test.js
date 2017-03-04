import spawnCommand from 'spawn-command'
import crossEnv from '.'

beforeEach(() => {
  spawnCommand.__mock.reset()
})

test(`sets environment variables and run the remaining command`, () => {
  testEnvSetting({FOO_ENV: 'production'}, 'FOO_ENV=production')
})

test(`APPDATAs be undefined and not string`, () => {
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

test(`does nothing given no command`, () => {
  crossEnv([])
  expect(spawnCommand).toHaveBeenCalledTimes(0)
})

test(`propagates kill signals`, () => {
  testEnvSetting({FOO_ENV: 'foo=bar'}, 'FOO_ENV="foo=bar"')

  process.emit('SIGTERM')
  process.emit('SIGINT')
  process.emit('SIGHUP')
  process.emit('SIGBREAK')
  expect(spawnCommand.__mock.spawned.kill).toHaveBeenCalledWith('SIGTERM')
  expect(spawnCommand.__mock.spawned.kill).toHaveBeenCalledWith('SIGINT')
  expect(spawnCommand.__mock.spawned.kill).toHaveBeenCalledWith('SIGHUP')
  expect(spawnCommand.__mock.spawned.kill).toHaveBeenCalledWith('SIGBREAK')
})

test('can spawn a group of scripts in a string', () => {
  crossEnv(['FOO_ENV=baz', '"echo $baz && echo $baz"'])
  expect(spawnCommand).toHaveBeenCalledTimes(1)
  expect(spawnCommand).toHaveBeenCalledWith('"echo $baz && echo $baz" ', {
    stdio: 'inherit',
    env: expect.any(Object),
  })
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
  expect(ret, 'returns what spawn returns').toBe(spawnCommand.__mock.spawned)
  expect(spawnCommand).toHaveBeenCalledTimes(1)
  expect(spawnCommand).toHaveBeenCalledWith('echo hello world', {
    stdio: 'inherit',
    env: Object.assign({}, process.env, env),
  })

  expect(spawnCommand.__mock.spawned.on).toHaveBeenCalledTimes(1)
  expect(spawnCommand.__mock.spawned.on).toHaveBeenCalledWith(
    'exit',
    expect.any(Function),
  )
}
