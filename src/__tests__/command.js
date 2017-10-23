import isWindowsMock from 'is-windows'
import commandConvert from '../command'

const env = {
  test: 'a',
  test1: 'b',
  test2: 'c',
  test3: 'd',
  'empty_var': ''
}

beforeEach(() => {
  isWindowsMock.__mock.reset()
})

test(`converts unix-style env variable usage for windows`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(commandConvert('$test', env)).toBe('%test%')
})

test(`leaves command unchanged when not a variable`, () => {
  expect(commandConvert('test', env)).toBe('test')
})

test(`doesn't convert windows-style env variable`, () => {
  isWindowsMock.__mock.returnValue = false
  expect(commandConvert('%test%', env)).toBe('%test%')
})

test(`leaves variable unchanged when using correct operating system`, () => {
  isWindowsMock.__mock.returnValue = false
  expect(commandConvert('$test', env)).toBe('$test')
})

test(`is stateless`, () => {
  // this test prevents falling into regexp traps like this:
  // http://stackoverflow.com/a/1520853/971592
  isWindowsMock.__mock.returnValue = true
  expect(commandConvert('$test', env)).toBe(commandConvert('$test', env))
})

test(`converts embedded unix-style env variables usage for windows`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(commandConvert('$test1/$test2/$test3', env)).toBe('%test1%/%test2%/%test3%')
})

// eslint-disable-next-line max-len
test(`leaves embedded variables unchanged when using correct operating system`, () => {
  isWindowsMock.__mock.returnValue = false
  expect(commandConvert('$test1/$test2/$test3', env)).toBe('$test1/$test2/$test3')
})

test(`converts braced unix-style env variable usage for windows`, () => {
  isWindowsMock.__mock.returnValue = true
  // eslint-disable-next-line no-template-curly-in-string
  expect(commandConvert('${test}', env)).toBe('%test%')
})

test(`removes non-existent variables from the converted command`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(commandConvert('$test1/$foo/$test2', env)).toBe('%test1%//%test2%')
})

test(`removes empty variables from the converted command`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(commandConvert('$foo/$test/$empty_var', env)).toBe('/%test%/')
})

test(`normalizes command on windows`, () => {
  isWindowsMock.__mock.returnValue = true
  // index.js calls `commandConvert` with `normalize` param
  // as `true` for command only
  expect(commandConvert('./cmd.bat', env, true)).toBe('cmd.bat')
})
