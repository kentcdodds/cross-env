import isWindowsMock from 'is-windows'
import varValueConvert from './variable'

beforeEach(() => {
  isWindowsMock.__mock.reset()
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
