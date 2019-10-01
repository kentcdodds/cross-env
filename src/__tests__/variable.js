import isWindowsMock from '../is-windows'
import varValueConvert from '../variable'

jest.mock('../is-windows')

const JSON_VALUE = '{\\"foo\\":\\"bar\\"}'

beforeEach(() => {
  process.env.VAR1 = 'value1'
  process.env.VAR2 = 'value2'
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
  // eslint-disable-next-line no-template-curly-in-string
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
