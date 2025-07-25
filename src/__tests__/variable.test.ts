import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import * as isWindowsModule from '../is-windows.js'
import { varValueConvert } from '../variable.js'

vi.mock('../is-windows.js')

const JSON_VALUE = '{\\"foo\\":\\"bar\\"}'

beforeEach(() => {
	process.env.VAR1 = 'value1'
	process.env.VAR2 = 'value2'
	process.env.JSON_VAR = JSON_VALUE
})

afterEach(() => {
	const { env } = process
	delete env.VAR1
	delete env.VAR2
	delete env.JSON_VAR
	vi.clearAllMocks()
})

describe('varValueConvert', () => {
	test("doesn't affect simple variable values", () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo', 'TEST')).toBe('foo')
	})

	test("doesn't convert a ; into a : on UNIX", () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(varValueConvert('foo;bar', 'PATH')).toBe('foo;bar')
	})

	test("doesn't convert a ; into a : for non-PATH on UNIX", () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(varValueConvert('foo;bar', 'FOO')).toBe('foo;bar')
	})

	test("doesn't convert a ; into a : for non-PATH on Windows", () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo;bar', 'FOO')).toBe('foo;bar')
	})

	test('converts a : into a ; on Windows if PATH', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo:bar', 'PATH')).toBe('foo;bar')
	})

	test("doesn't convert already valid separators", () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(varValueConvert('foo:bar', 'TEST')).toBe('foo:bar')
	})

	test("doesn't convert escaped separators on Windows if PATH", () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo\\:bar', 'PATH')).toBe('foo:bar')
	})

	test("doesn't convert escaped separators on UNIX", () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(varValueConvert('foo\\:bar', 'PATH')).toBe('foo:bar')
	})

	test('converts a separator even if preceded by an escaped backslash', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo\\\\:bar', 'PATH')).toBe('foo\\\\;bar')
	})

	test('converts multiple separators if PATH', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo:bar:baz', 'PATH')).toBe('foo;bar;baz')
	})

	test('resolves an env variable value', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo-$VAR1', 'TEST')).toBe('foo-value1')
	})

	test('resolves an env variable value with curly syntax', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo-${VAR1}', 'TEST')).toBe('foo-value1')
	})

	test('resolves multiple env variable values', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo-$VAR1-$VAR2', 'TEST')).toBe('foo-value1-value2')
	})

	test('resolves an env variable value for non-existant variable', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('foo-$VAR_POTATO', 'TEST')).toBe('foo-')
	})

	test('resolves an env variable with a JSON string value on Windows', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('$JSON_VAR', 'TEST')).toBe(JSON_VALUE)
	})

	test('resolves an env variable with a JSON string value on UNIX', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(varValueConvert('$JSON_VAR', 'TEST')).toBe(JSON_VALUE)
	})

	test('does not resolve an env variable prefixed with \\ on Windows', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('\\$VAR1', 'TEST')).toBe('$VAR1')
	})

	test('does not resolve an env variable prefixed with \\ on UNIX', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(varValueConvert('\\$VAR1', 'TEST')).toBe('$VAR1')
	})

	test('resolves an env variable prefixed with \\\\ on Windows', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(varValueConvert('\\\\$VAR1', 'TEST')).toBe('\\value1')
	})

	test('resolves an env variable prefixed with \\\\ on UNIX', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(varValueConvert('\\\\$VAR1', 'TEST')).toBe('\\value1')
	})
})
