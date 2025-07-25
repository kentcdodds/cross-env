import { describe, test, expect, vi, afterEach } from 'vitest'
import { commandConvert } from '../command.js'
import * as isWindowsModule from '../is-windows.js'

vi.mock('../is-windows.js')

const env = {
	test: 'a',
	test1: 'b',
	test2: 'c',
	test3: 'd',
	empty_var: '',
}

afterEach(() => {
	vi.clearAllMocks()
})

describe('commandConvert', () => {
	test('converts unix-style env variable usage for windows', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(commandConvert('$test', env)).toBe('%test%')
	})

	test('leaves command unchanged when not a variable', () => {
		expect(commandConvert('test', env)).toBe('test')
	})

	test("doesn't convert windows-style env variable", () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(commandConvert('%test%', env)).toBe('%test%')
	})

	test('leaves variable unchanged when using correct operating system', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(commandConvert('$test', env)).toBe('$test')
	})

	test('is stateless', () => {
		// this test prevents falling into regexp traps like this:
		// http://stackoverflow.com/a/1520853/971592
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(commandConvert('$test', env)).toBe(commandConvert('$test', env))
	})

	test('converts embedded unix-style env variables usage for windows', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(commandConvert('$test1/$test2/$test3', env)).toBe(
			'%test1%/%test2%/%test3%',
		)
	})

	test('leaves embedded variables unchanged when using correct operating system', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(false)
		expect(commandConvert('$test1/$test2/$test3', env)).toBe(
			'$test1/$test2/$test3',
		)
	})

	test('converts braced unix-style env variable usage for windows', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(commandConvert('${test}', env)).toBe('%test%')
	})

	test('removes non-existent variables from the converted command', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(commandConvert('$test1/$foo/$test2', env)).toBe('%test1%//%test2%')
	})

	test('removes empty variables from the converted command', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		expect(commandConvert('$foo/$test/$empty_var', env)).toBe('/%test%/')
	})

	test('normalizes command on windows', () => {
		vi.mocked(isWindowsModule.isWindows).mockReturnValue(true)
		// index.js calls `commandConvert` with `normalize` param
		// as `true` for command only
		expect(commandConvert('./cmd.bat', env, true)).toBe('cmd.bat')
	})
})
