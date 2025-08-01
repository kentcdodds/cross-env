import { isWindows } from './is-windows.js'

const pathLikeEnvVarWhitelist = new Set(['PATH', 'NODE_PATH'])

/**
 * This will transform UNIX-style list values to Windows-style.
 * For example, the value of the $PATH variable "/usr/bin:/usr/local/bin:."
 * will become "/usr/bin;/usr/local/bin;." on Windows.
 * @param varValue Original value of the env variable
 * @param varName Original name of the env variable
 * @returns Converted value
 */
function replaceListDelimiters(varValue: string, varName = ''): string {
	const targetSeparator = isWindows() ? ';' : ':'
	if (!pathLikeEnvVarWhitelist.has(varName)) {
		return varValue
	}

	return varValue.replace(/(\\*):/g, (match, backslashes) => {
		if (backslashes.length % 2) {
			// Odd number of backslashes preceding it means it's escaped,
			// remove 1 backslash and return the rest as-is
			return match.substring(1)
		}
		return backslashes + targetSeparator
	})
}

/**
 * This will attempt to resolve the value of any env variables that are inside
 * this string. For example, it will transform this:
 * cross-env FOO=$NODE_ENV BAR=\\$NODE_ENV echo $FOO $BAR
 * Into this:
 * FOO=development BAR=$NODE_ENV echo $FOO
 * (Or whatever value the variable NODE_ENV has)
 * Note that this function is only called with the right-side portion of the
 * env var assignment, so in that example, this function would transform
 * the string "$NODE_ENV" into "development"
 * @param varValue Original value of the env variable
 * @returns Converted value
 */
function resolveEnvVars(varValue: string): string {
	const envUnixRegex = /(\\*)(\$(\w+)|\${(\w+)})/g // $my_var or ${my_var} or \$my_var
	return varValue.replace(
		envUnixRegex,
		(_, escapeChars, varNameWithDollarSign, varName, altVarName) => {
			// do not replace things preceded by a odd number of \
			if (escapeChars.length % 2 === 1) {
				return varNameWithDollarSign
			}
			return (
				escapeChars.substring(0, escapeChars.length / 2) +
				(process.env[varName || altVarName] || '')
			)
		},
	)
}

/**
 * Converts an environment variable value to be appropriate for the current OS.
 * @param originalValue Original value of the env variable
 * @param originalName Original name of the env variable
 * @returns Converted value
 */
export function varValueConvert(
	originalValue: string,
	originalName: string,
): string {
	return resolveEnvVars(replaceListDelimiters(originalValue, originalName))
}
