import isWindowsMock from 'is-windows'
import commandConvert from './command'

beforeEach(() => {
  isWindowsMock.__mock.reset()
})

test(`converts unix-style env variable usage for windows`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(commandConvert('$test')).toBe('%test%')
})

test(`leaves command unchanged when not a variable`, () => {
  expect(commandConvert('test')).toBe('test')
})
test(`converts windows-style env variable usage for linux`, () => {
  isWindowsMock.__mock.returnValue = false
  expect(commandConvert('%test%')).toBe('$test')
})

test(`leaves variable unchanged when using correct operating system`, () => {
  isWindowsMock.__mock.returnValue = true
  expect(commandConvert('$test')).toBe('$test')
})
