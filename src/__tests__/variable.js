/* eslint-disable no-template-curly-in-string */
const isWindowsMock = require('../is-windows')
const varValueConvert = require('../variable')

jest.mock('../is-windows')

const JSON_VALUE = '{\\"foo\\":\\"bar\\"}'

beforeEach(() => {
  process.env.VAR1 = 'value1'
  process.env.VAR2 = 'value2'
  process.env.EMPTY_VAR = ''
  process.env.JSON_VAR = JSON_VALUE
})

afterEach(() => {
  const {env} = process
  delete env.VAR1
  delete env.VAR2
  delete env.JSON_VAR
  jest.clearAllMocks()
})

test(`doesn't affect simple variable values`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo')).toBe('foo')
})

test(`doesn't convert a ; into a : on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('foo;bar', 'PATH')).toBe('foo;bar')
})

test(`doesn't convert a ; into a : for non-PATH on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('foo;bar', 'FOO')).toBe('foo;bar')
})

test(`doesn't convert a ; into a : for non-PATH on Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo;bar', 'FOO')).toBe('foo;bar')
})

test(`converts a : into a ; on Windows if PATH`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo:bar', 'PATH')).toBe('foo;bar')
})

test(`doesn't convert already valid separators`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('foo:bar')).toBe('foo:bar')
})

test(`doesn't convert escaped separators on Windows if PATH`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo\\:bar', 'PATH')).toBe('foo:bar')
})

test(`doesn't convert escaped separators on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('foo\\:bar', 'PATH')).toBe('foo:bar')
})

test(`converts a separator even if preceded by an escaped backslash`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo\\\\:bar', 'PATH')).toBe('foo\\\\;bar')
})

test(`converts multiple separators if PATH`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo:bar:baz', 'PATH')).toBe('foo;bar;baz')
})

test(`resolves an env variable value`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo-$VAR1')).toBe('foo-value1')
})

test(`resolves an env variable value with curly syntax`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo-${VAR1}')).toBe('foo-value1')
})

test(`resolves multiple env variable values`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo-$VAR1-$VAR2')).toBe('foo-value1-value2')
})

test(`resolves an env variable value for non-existant variable`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('foo-$VAR_POTATO')).toBe('foo-')
})

test(`resolves an env variable with a JSON string value on Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('$JSON_VAR')).toBe(JSON_VALUE)
})

test(`resolves an env variable with a JSON string value on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('$JSON_VAR')).toBe(JSON_VALUE)
})

test(`does not resolve an env variable prefixed with \\ on Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('\\$VAR1')).toBe('$VAR1')
})

test(`does not resolve a $ without a word after it in UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('hello $ the case')).toBe('hello $ the case')
})

test(`does not resolve a $ without a word after it in Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('hello $ the case')).toBe('hello $ the case')
})

test(`does not resolve an env variable if it isn't prefix with a $ but is in curly braces \\ on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('{VAR1}')).toBe('{VAR1}')
})

test(`does not resolve an env variable if it isn't prefix with a $ but is in curly braces \\ on Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('{VAR1}')).toBe('{VAR1}')
})

test(`does not resolve an env variable prefixed with \\ on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('\\$VAR1')).toBe('$VAR1')
})

test(`resolves an env variable prefixed with \\\\ on Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('\\\\$VAR1')).toBe('\\value1')
})

test(`resolves an env variable prefixed with \\\\ on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('\\\\$VAR1')).toBe('\\value1')
})

test(`does not resolve an env variable prefixed with \\$\{ on Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('\\${VAR1}')).toBe('${VAR1}')
})

test(`does not resolve an env variable prefixed with \\$\{ on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('\\${VAR1}')).toBe('${VAR1}')
})

test(`resolves an env variable prefixed with \\\\$\{ on Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('\\\\${VAR1}')).toBe('\\value1')
})

test(`resolves an env variable prefixed with \\\\$\{ on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('\\\\${VAR1}')).toBe('\\value1')
})

test(`resolves default value for missing variable on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('${UNKNOWN_UNIX_VAR:-defaultUnix}')).toBe(
    'defaultUnix',
  )
})

test(`resolves default value for missing variable on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('${UNKNOWN_WINDOWS_VAR:-defaultWindows}')).toBe(
    'defaultWindows',
  )
})

test(`resolves default value for empty string variable on UNIX`, () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('${EMPTY_VAR:-defaultUnix}')).toBe('defaultUnix')
})

test(`resolves default value for empty string variable on windows`, () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('${EMPTY_VAR:-defaultWindows}')).toBe('defaultWindows')
})

test('resolves default value recursively when primary and secondary doesnt exist in UNIX', () => {
  isWindowsMock.mockReturnValue(false)
  expect(
    varValueConvert('${EMPTY_VAR:-foobar${MISSING_VAR:-defaultUnix}}'),
  ).toBe('foobardefaultUnix')
})

test('resolves secondary value recursively when primary doesnt exist in UNIX', () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('${EMPTY_VAR:-bang${VAR1:-defaultUnix}}')).toBe(
    'bangvalue1',
  )
})

test('resolves default value recursively when primary and secondary doesnt exist in windows', () => {
  isWindowsMock.mockReturnValue(true)
  expect(
    varValueConvert('${EMPTY_VAR:-foobar${MISSING_VAR:-defaultWindows}}'),
  ).toBe('foobardefaultWindows')
})

test('resolves secondary value recursively when primary doesnt exist in windows', () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('${EMPTY_VAR:-bang${VAR1:-defaultWindows}}')).toBe(
    'bangvalue1',
  )
})

test('resolves the current working directory inside string in windows', () => {
  isWindowsMock.mockReturnValue(true)
  expect(varValueConvert('${PWD}\\ADirectory')).toBe(
    `${process.cwd()}\\ADirectory`,
  )
})

test('resolves the current working directory inside string in UNIX', () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('${PWD}/adir')).toBe(`${process.cwd()}/adir`)
})

test('resolves a very complex string with defaults and PWD in Windows', () => {
  isWindowsMock.mockReturnValue(true)
  expect(
    varValueConvert(
      'start-${PWD}-${EMPTY_VAR:-${NO_VAR:-$VAR1}}-${NO_VAR:-$VAR2}-${NO_VAR:-${EMPTY_VAR:-value3}}-${EMPTY_VAR:-$PWD}-end',
    ),
  ).toBe(`start-${process.cwd()}-value1-value2-value3-${process.cwd()}-end`)
})

test('sequential variables  resolves in UNIX', () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('start-$VAR1$VAR2-end')).toBe('start-value1value2-end')
})

test('sequential variables with brackets resolves in UNIX', () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('start-${VAR1}$VAR2-end')).toBe(
    'start-value1value2-end',
  )
})

test('sequential variables resolves in UNIX', () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('start-$VAR1$VAR2-end')).toBe('start-value1value2-end')
})

test('reversed sequential variables with brackets resolves in UNIX', () => {
  isWindowsMock.mockReturnValue(false)
  expect(varValueConvert('start-$VAR1${VAR2}-end')).toBe(
    'start-value1value2-end',
  )
})
