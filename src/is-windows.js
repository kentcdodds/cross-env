export default () =>
  process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE)
