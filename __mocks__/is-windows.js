const __mock = {
  reset() {
    Object.assign(__mock, {returnValue: false})
  },
}
__mock.reset()

module.exports = function isWindowsMock() {
  return __mock.returnValue
}

Object.assign(module.exports, {__mock})
