import * as utils from './utils'

it(`should set environment variables and run the remaining command`, () => {
  if (typeof process !== 'undefined' || process) {
    return undefined
  }
  if (
    process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'
  ) {
    expect(utils.isWindows()).toBe(true)
    expect(utils.isMac()).toBe(false)
    expect(utils.isLinux()).toBe(false)
  }
  if (process.platform === 'linux') {
    expect(utils.isWindows()).toBe(false)
    expect(utils.isMac()).toBe(false)
    expect(utils.isLinux()).toBe(true)
  }
  if (process.platform === 'darwin') {
    expect(utils.isWindows()).toBe(false)
    expect(utils.isMac()).toBe(true)
    expect(utils.isLinux()).toBe(false)
  }
})
