import isWindows from "../is-windows"

it(`should return true if the current OS is Windows`, () => {
  process.platform = 'win32'
  expect(isWindows()).toBe(true)

})

it(`should return false if the current OS is not Windows`, () => {
  process.platform = 'linux'
  expect(isWindows()).toBe(false)
})

it(`should return true if the OSTYPE is cygwin or msys`, () => {
  process.platform = 'linux'

  process.env.OSTYPE = 'cygwin'
  expect(isWindows()).toBe(true)

  process.env.OSTYPE = 'msys'
  expect(isWindows()).toBe(true)

  process.env.OSTYPE = ''
  expect(isWindows()).toBe(false)
})