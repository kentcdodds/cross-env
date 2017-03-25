import isWindowsMock from 'is-windows'
import varValueConvert from './variable'

beforeEach(() => {
  process.env.VAR1 = 'value1'
  process.env.VAR2 = 'value2'
  isWindowsMock.__mock.reset()
})

afterEach(() => {
  delete process.env.VAR1
  delete process.env.VAR2
})

test(`doesn't affect simple variable values`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(varValueConvert('foo')).toBe('foo')
})

test(`doesn't convert a ; into a : on UNIX`, () => {
  isWindowsMock.__mock.returnValue = false
  expect(varValueConvert('foo;bar')).toBe('foo;bar')
})

test(`converts a : into a ; on Windows`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(varValueConvert('foo:bar')).toBe('foo;bar')
})

test(`doesn't convert already valid separators`, () => {
  isWindowsMock.__mock.returnValue = false
  expect(varValueConvert('foo:bar')).toBe('foo:bar')
})

test(`doesn't convert escaped separators on Windows`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(varValueConvert('foo\\:bar')).toBe('foo:bar')
})

test(`doesn't convert escaped separators on UNIX`, () => {
  isWindowsMock.__mock.returnValue = false
  expect(varValueConvert('foo\\:bar')).toBe('foo:bar')
})

test(`converts a separator even if preceded by an escaped backslash`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(varValueConvert('foo\\\\:bar')).toBe('foo\\\\;bar')
})

test(`converts multiple separators`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(varValueConvert('foo:bar:baz')).toBe('foo;bar;baz')
})

test(`resolves an env variable value`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(varValueConvert('foo-$VAR1')).toBe('foo-value1')
})

test(`resolves an env variable value with curly syntax`, () => {
  isWindowsMock.__mock.returnValue = true
  // eslint-disable-next-line no-template-curly-in-string
  expect(varValueConvert('foo-${VAR1}')).toBe('foo-value1')
})

test(`resolves multiple env variable values`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(varValueConvert('foo-$VAR1-$VAR2')).toBe('foo-value1-value2')
})

test(`resolves an env variable value for non-existant variable`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(varValueConvert('foo-$VAR_POTATO')).toBe('foo-')
})
