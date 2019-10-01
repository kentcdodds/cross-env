import isWindows from '../is-windows'

const {
  platform,
  env: {OSTYPE},
} = process

// make the platform property writeable
Object.defineProperty(process, 'platform', {
  value: platform,
  writable: true,
})

afterEach(() => {
  process.platform = platform
  process.env.OSTYPE = OSTYPE
})

test(`returns true if the current OS is Windows`, () => {
  process.platform = 'win32'
  expect(isWindows()).toBe(true)
})

test(`returns false if the current OS is not Windows`, () => {
  process.platform = 'linux'
  expect(isWindows()).toBe(false)
})

test(`returns true if the OSTYPE is cygwin or msys`, () => {
  process.platform = 'linux'

  process.env.OSTYPE = 'cygwin'
  expect(isWindows()).toBe(true)

  process.env.OSTYPE = 'msys'
  expect(isWindows()).toBe(true)

  process.env.OSTYPE = ''
  expect(isWindows()).toBe(false)
})
