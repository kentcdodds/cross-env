const __mock = {
  reset() {
    __mock.spawned = null
    Object.assign(module.exports, {
      __mock,
      spawn: jest.fn(() => {
        __mock.spawned = {
          on: jest.fn(),
          kill: jest.fn(),
        }
        return __mock.spawned
      }),
    })
  },
}

__mock.reset()
