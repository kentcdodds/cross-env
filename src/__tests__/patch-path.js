const patchPathEnv = require('../patch-path')
const isWindowsMock = require('../is-windows')

jest.mock('../is-windows')

beforeEach(() => {
  isWindowsMock.mockReturnValue(true)
})

test(`remove duplicate of PATH variable if the current OS is Windows`, () => {
  isWindowsMock.mockReturnValue(true)
  const env = {PATH: 'path1', Path: 'path2'}
  patchPathEnv(env)
  expect(env).toStrictEqual({PATH: 'path1'})
})

test(`do nothing if the current OS is not Windows`, () => {
  isWindowsMock.mockReturnValue(false)
  const env = {PATH: 'path1', Path: 'path2'}
  patchPathEnv(env)
  expect(env).toStrictEqual({PATH: 'path1', Path: 'path2'})
})
