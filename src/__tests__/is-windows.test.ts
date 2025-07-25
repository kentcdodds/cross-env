import { describe, test, expect, afterEach, vi } from 'vitest'
import { isWindows } from '../is-windows.js'

const {
	env: { OSTYPE },
} = process

afterEach(() => {
	process.env.OSTYPE = OSTYPE
})

describe('isWindows', () => {
	test('returns true if the current OS is Windows', () => {
		vi.stubGlobal('process', { ...process, platform: 'win32' })
		expect(isWindows()).toBe(true)
	})

	test('returns false if the current OS is not Windows', () => {
		vi.stubGlobal('process', { ...process, platform: 'linux' })
		expect(isWindows()).toBe(false)
	})

	test('returns true if the OSTYPE is cygwin or msys', () => {
		vi.stubGlobal('process', { ...process, platform: 'linux' })

		process.env.OSTYPE = 'cygwin'
		expect(isWindows()).toBe(true)

		process.env.OSTYPE = 'msys'
		expect(isWindows()).toBe(true)

		process.env.OSTYPE = ''
		expect(isWindows()).toBe(false)
	})
})
