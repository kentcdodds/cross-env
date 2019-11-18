/* eslint-disable no-template-curly-in-string */
const isWindowsMock = require('../is-windows')
const commandConvert = require('../command')

jest.mock('../is-windows')

const env = {
  test: 'a',
  test1: 'b',
  test2: 'c',
  test3: 'd',
  // eslint-disable-next-line babel/camelcase
  empty_var: '',
}

afterEach(() => {
  jest.clearAllMocks()
})

test(`converts unix-style env variable usage for windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(commandConvert('$test', env)).toBe('%test%')
})

test(`leaves command unchanged when not a variable`, () => {
  expect(commandConvert('test', env)).toBe('test')
})

test(`doesn't convert windows-style env variable`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(commandConvert('%test%', env)).toBe('%test%')
})

test(`leaves variable unchanged when using correct operating system`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(commandConvert('$test', env)).toBe('$test')
})

test(`is stateless`, () => {
  // this test prevents falling into regexp traps like this:
  // http://stackoverflow.com/a/1520853/971592
  isWindowsMock.mockReturnValue(true)
  expect(commandConvert('$test', env)).toBe(commandConvert('$test', env))
})

test(`converts embedded unix-style env variables usage for windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(commandConvert('$test1/$test2/$test3', env)).toBe(
    '%test1%/%test2%/%test3%',
  )
})

// eslint-disable-next-line max-len
test(`leaves embedded variables unchanged when using correct operating system`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(commandConvert('$test1/$test2/$test3', env)).toBe(
    '$test1/$test2/$test3',
  )
})

test(`converts braced unix-style env variable usage for windows`, () => {
  isWindowsMock.mockReturnValue(true)

  expect(commandConvert('${test}', env)).toBe('%test%')
})

test(`removes non-existent variables from the converted command`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(commandConvert('$test1/$foo/$test2', env)).toBe('%test1%//%test2%')
})

test(`removes empty variables from the converted command`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(commandConvert('$foo/$test/$empty_var', env)).toBe('/%test%/')
})

test(`normalizes command on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  // index.js calls `commandConvert` with `normalize` param
  // as `true` for command only
  expect(commandConvert('./cmd.bat', env, true)).toBe('cmd.bat')
})

test(`evaluates default values for missing environment variables on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(commandConvert('$test1/${foo:-bar}/$test2', env)).toBe(
    '%test1%/bar/%test2%',
  )
})

test(`evaluates default values for empty environment variables on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(commandConvert('$test1/${empty_var:-bang}/$test2', env)).toBe(
    '%test1%/bang/%test2%',
  )
})

test(`evaluates default values recursively for empty environment variables on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(
    commandConvert('$test1/${empty_var:-${missing_var:-bang}}/$test2', env),
  ).toBe('%test1%/bang/%test2%')
})

test(`evaluates secondary values recursively for environment variables on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(
    commandConvert('$test1/${empty_var:-${test3:-bang}}/$test2', env),
  ).toBe('%test1%/%test3%/%test2%')
})
