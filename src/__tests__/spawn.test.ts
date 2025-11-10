import { ChildProcess } from 'child_process'
import { spawn } from '../spawn.js'
import { describe, test, expect } from 'vitest'

describe('spawn', () => {
	test('Must return spawn-like instance', () => {
		const proc = spawn('node', ['-v'])
		expect(proc).toBeInstanceOf(ChildProcess)
	})
})
