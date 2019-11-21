module.exports = envReplace

/**
 * This will attempt to resolve the value of any env variables that are inside
 * this string. For example, it will transform this:
 * cross-env FOO=$NODE_ENV BAR=\\$NODE_ENV echo $FOO ${BAR}
 * Into this:
 * FOO=development BAR=$NODE_ENV echo $FOO
 * (Or whatever value the variable NODE_ENV has)
 * Note that this function is only called with the right-side portion of the
 * env var assignment, so in that example, this function would transform
 * the string "$NODE_ENV" into "development"
 *
 * To specify a default value for a variable, use the ${ENV_VAR_NAME:-default value} syntax.
 *
 * The default value syntax can be nested to resolve multiple environment variables:
 *   ${VAR1:-${VAR2:-${VAR3:-default if none set}}}
 *
 * @param {String} value The command/value to replace
 * @param {Object} env optional environment object (defaults to process.env)
 * @param {boolean} winEnvReplace If true, replace environment variables with '%NAME%' instead of their actual value
 * @returns {String} the value with replacements
 **/
// state machine requires slightly more complexity than normally required
// eslint-disable-next-line complexity
function envReplace(value, env = process.env, winEnvReplace = false) {
  let lastDollar = false
  let braceCount = 0
  let startIndex = 0
  let escapeCount = 0
  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i)
    switch (char) {
      case '\\':
        if (braceCount === 0) {
          escapeCount++
        }
        break
      case '$':
        lastDollar = true
        break
      case '{':
        if (lastDollar) {
          if (braceCount === 0) {
            startIndex = i - 1
          }
          braceCount++
        }
        lastDollar = false
        break
      case '}':
        if (braceCount > 0) {
          if (i > 0 && value.charAt(i - 1) === '\\') {
            //ignore for now
          } else if (braceCount === 1) {
            // Case of ${ENVIRONMENT_VARIABLE_1_NAME:-default value} OR
            // ${ENVIRONMENT_VARIABLE_1_NAME:-${ENVIRONMENT_VARIABLE_2_NAME:-default value}}
            const prefix = value.substring(
              0,
              startIndex - Math.round(escapeCount / 2),
            )
            const match = value.substring(startIndex, i + 1)
            const suffix = value.length > i + 1 ? value.substring(i + 1) : ''
            const replace =
              escapeCount % 2 === 1
                ? match
                : replaceMatch(match, env, winEnvReplace).replace(/\\}/g, '}')
            const beforeLength = value.length
            value = `${prefix}${replace}${suffix}`
            i = i - beforeLength + value.length
            escapeCount = 0
            braceCount = 0
          } else {
            braceCount--
          }
        }
        lastDollar = false
        break
      default:
        // Case of $ENVIRONMENT_VARIABLE_1_NAME
        if (lastDollar && braceCount === 0) {
          const matchedRest = /^(\w+).*$/g.exec(value.substring(i))
          if (matchedRest !== null) {
            const envVarName = matchedRest[1]
            const prefix = value.substring(
              0,
              i - Math.round(escapeCount / 2) - 1,
            )
            const match = value.substring(i - 1, i + envVarName.length)
            const suffix =
              value.length > i + envVarName.length
                ? value.substring(i + envVarName.length)
                : ''
            const replace =
              escapeCount % 2 === 1
                ? match
                : replaceMatch(match, env, winEnvReplace)
            const beforeLength = value.length
            value = `${prefix}${replace}${suffix}`
            i = i - beforeLength + value.length
          }
        }
        if (braceCount === 0) {
          escapeCount = 0
        }
        lastDollar = false
    }
  }
  return value
}

function replaceMatch(match, env, winEnvReplace) {
  let envVarName =
    match.charAt(1) === '{'
      ? match.substring(2, match.length - 1)
      : match.substring(1)
  if (envVarName === 'PWD') {
    return process.cwd()
  }

  let defaultValue = ''
  const defSepInd = envVarName.indexOf(':-')
  // if there is a default value given (i.e. using the ':-' syntax)
  if (defSepInd > 0) {
    defaultValue = envReplace(
      envVarName.substring(defSepInd + 2),
      env,
      winEnvReplace,
    )
    envVarName = envVarName.substring(0, defSepInd)
  }

  if (winEnvReplace) {
    return (env[envVarName] && `%${envVarName}%`) || defaultValue
  } else {
    return env[envVarName] || defaultValue
  }
}
