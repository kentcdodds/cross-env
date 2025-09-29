import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { commandConvert } from '../command.js'
import * as isWindowsModule from '../is-windows.js'

vi.mock('../is-windows.js')

describe('commandConvert - Environment Variable Default Values', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	test('should handle ${VAR:-default} syntax on Windows when VAR is undefined', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		const env = {} // PORT is not defined
		const command = 'wrangler dev --port ${PORT:-8787}'

		const result = commandConvert(command, env)

		// Should use the default value when PORT is not defined
		expect(result).toBe('wrangler dev --port 8787')
	})

	test('should handle ${VAR:-default} syntax on Windows when VAR is defined', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		const env = { PORT: '3000' }
		const command = 'wrangler dev --port ${PORT:-8787}'

		const result = commandConvert(command, env)

		// Should use the defined value when PORT is defined
		expect(result).toBe('wrangler dev --port 3000')
	})

	test('should handle ${VAR:-default} syntax on Unix (no conversion needed)', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		const env = {} // PORT is not defined
		const command = 'wrangler dev --port ${PORT:-8787}'

		const result = commandConvert(command, env)

		// On Unix, no conversion is needed
		expect(result).toBe('wrangler dev --port ${PORT:-8787}')
	})

	test('should handle simple ${VAR} syntax on Windows', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		const env = { PORT: '3000' }
		const command = 'wrangler dev --port ${PORT}'

		const result = commandConvert(command, env)

		// This works correctly
		expect(result).toBe('wrangler dev --port %PORT%')
	})

	test('should handle simple ${VAR} syntax on Windows when VAR is undefined', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		const env = {} // PORT is not defined
		const command = 'wrangler dev --port ${PORT}'

		const result = commandConvert(command, env)

		// This works correctly - strips undefined variables
		expect(result).toBe('wrangler dev --port ')
	})

	test('should handle multiple default value syntaxes in one command', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		const env = { HOST: 'localhost' } // PORT is not defined
		const command = 'wrangler dev --host ${HOST:-0.0.0.0} --port ${PORT:-8787}'

		const result = commandConvert(command, env)

		// Should use defined value for HOST and default for PORT
		expect(result).toBe('wrangler dev --host localhost --port 8787')
	})

	test('should handle default values with special characters', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		const env = {} // NODE_ENV is not defined
		const command = 'node app.js --env ${NODE_ENV:-development}'

		const result = commandConvert(command, env)

		// Should use the default value
		expect(result).toBe('node app.js --env development')
	})

	test('should handle default values with spaces', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		const env = {} // MESSAGE is not defined
		const command = 'echo ${MESSAGE:-hello world}'

		const result = commandConvert(command, env)

		// Should use the default value with spaces
		expect(result).toBe('echo hello world')
	})
})
