export function isWindows() {
  if (typeof process === 'undefined' || !process) {
    return false
  }
  return (
    process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'
  )
}
export function isMac() {
  if (typeof process === 'undefined' || !process) {
    return false
  }
  return process.platform === 'darwin'
}
export function isLinux() {
  if (typeof process === 'undefined' || !process) {
    return false
  }
  return process.platform === 'linux'
}
