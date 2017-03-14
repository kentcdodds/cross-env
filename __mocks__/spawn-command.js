const __mock = {
  reset() {
    __mock.spawned = null
    module.exports.__mock = __mock
    module.exports.mockClear()
  },
}

module.exports = jest.fn(() => {
  __mock.spawned = {
    on: jest.fn(),
    kill: jest.fn(),
  }
  return __mock.spawned
})

__mock.reset()
