const isWindows = require('./is-windows')

module.exports = patchPathEnv

function patchPathEnv(env) {
  if (isWindows() && env.Path && env.PATH) {
    delete env.Path
  }
}
