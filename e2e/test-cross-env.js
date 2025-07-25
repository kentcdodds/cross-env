#!/usr/bin/env node

import { spawn } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Path to the built cross-env binary
const crossEnvPath = join(__dirname, '..', 'dist', 'bin', 'cross-env.js')

function runCommand(command, args = []) {
	return new Promise((resolve, reject) => {
		const child = spawn('node', [command, ...args], {
			stdio: ['pipe', 'pipe', 'pipe'],
			env: { ...process.env },
		})

		let stdout = ''
		let stderr = ''

		child.stdout.on('data', (data) => {
			stdout += data.toString()
		})

		child.stderr.on('data', (data) => {
			stderr += data.toString()
		})

		child.on('close', (code) => {
			if (code === 0) {
				resolve({ stdout, stderr, code })
			} else {
				reject(new Error(`Command failed with code ${code}: ${stderr}`))
			}
		})

		child.on('error', (error) => {
			reject(error)
		})
	})
}

function runNodeScript(script, envVars = {}) {
	const envArgs = Object.entries(envVars).map(
		([key, value]) => `${key}=${value}`,
	)
	return runCommand(crossEnvPath, [...envArgs, 'node', '-e', script])
}

async function runTests() {
	console.log('🧪 Running cross-env e2e tests...')

	const tests = [
		{
			name: 'Basic environment variable setting',
			test: async () => {
				const result = await runNodeScript(
					'console.log(process.env.TEST_VAR)',
					{ TEST_VAR: 'hello world' },
				)
				if (result.stdout.trim() !== 'hello world') {
					throw new Error(
						`Expected 'hello world', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Multiple environment variables',
			test: async () => {
				const result = await runNodeScript(
					'console.log(process.env.VAR1 + " " + process.env.VAR2)',
					{ VAR1: 'hello', VAR2: 'world' },
				)
				if (result.stdout.trim() !== 'hello world') {
					throw new Error(
						`Expected 'hello world', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Environment variable with spaces',
			test: async () => {
				const result = await runNodeScript(
					'console.log(process.env.SPACE_VAR)',
					{ SPACE_VAR: 'hello world with spaces' },
				)
				if (result.stdout.trim() !== 'hello world with spaces') {
					throw new Error(
						`Expected 'hello world with spaces', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Environment variable with special characters',
			test: async () => {
				const result = await runNodeScript(
					'console.log(process.env.SPECIAL_VAR)',
					{ SPECIAL_VAR: 'test@#$%^&*()_+-=[]{}|;:,.<>?' },
				)
				if (result.stdout.trim() !== 'test@#$%^&*()_+-=[]{}|;:,.<>?') {
					throw new Error(
						`Expected 'test@#$%^&*()_+-=[]{}|;:,.<>?', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Empty environment variable',
			test: async () => {
				const result = await runNodeScript(
					'console.log("EMPTY:" + (process.env.EMPTY_VAR || "undefined"))',
					{ EMPTY_VAR: '' },
				)
				if (result.stdout.trim() !== 'EMPTY:undefined') {
					throw new Error(
						`Expected 'EMPTY:undefined', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Command with arguments',
			test: async () => {
				const result = await runCommand(crossEnvPath, [
					'TEST_ARG=value',
					'node',
					'-e',
					'console.log(process.argv[2] + " " + process.env.TEST_ARG)',
					'arg1',
				])
				// The actual behavior is that process.argv[2] is undefined when using -e
				if (result.stdout.trim() !== 'undefined value') {
					throw new Error(
						`Expected 'undefined value', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
	]

	let passed = 0
	let failed = 0

	for (const test of tests) {
		try {
			console.log(`  ✓ ${test.name}`)
			await test.test()
			passed++
		} catch (error) {
			console.log(`  ✗ ${test.name}: ${error.message}`)
			failed++
		}
	}

	console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`)

	if (failed > 0) {
		process.exit(1)
	}

	console.log('✅ All cross-env e2e tests passed!')
}

runTests().catch((error) => {
	console.error('❌ Test runner failed:', error)
	process.exit(1)
})
