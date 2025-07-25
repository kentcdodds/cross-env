#!/usr/bin/env node

import { spawn } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Path to the built cross-env-shell binary
const crossEnvShellPath = join(
	__dirname,
	'..',
	'dist',
	'bin',
	'cross-env-shell.js',
)

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

function runShellCommand(shellCommand, envVars = {}) {
	const envArgs = Object.entries(envVars).map(
		([key, value]) => `${key}=${value}`,
	)
	return runCommand(crossEnvShellPath, [...envArgs, shellCommand])
}

async function runTests() {
	console.log('🧪 Running cross-env-shell e2e tests...')

	const tests = [
		{
			name: 'Basic shell environment variable',
			test: async () => {
				const result = await runShellCommand('echo $TEST_VAR', {
					TEST_VAR: 'hello world',
				})
				if (result.stdout.trim() !== 'hello world') {
					throw new Error(
						`Expected 'hello world', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Multiple shell environment variables',
			test: async () => {
				const result = await runShellCommand('echo "$VAR1 $VAR2"', {
					VAR1: 'hello',
					VAR2: 'world',
				})
				if (result.stdout.trim() !== 'hello world') {
					throw new Error(
						`Expected 'hello world', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Shell command with pipe',
			test: async () => {
				const result = await runShellCommand('echo "test" | grep test', {
					GREP_COLOR: 'never',
				})
				if (result.stdout.trim() !== 'test') {
					throw new Error(`Expected 'test', got '${result.stdout.trim()}'`)
				}
			},
		},
		{
			name: 'Shell command with multiple statements',
			test: async () => {
				const result = await runShellCommand('echo "first"; echo "second"', {
					SEPARATOR: ';',
				})
				const lines = result.stdout.trim().split('\n')
				if (
					lines.length !== 2 ||
					lines[0] !== 'first' ||
					lines[1] !== 'second'
				) {
					throw new Error(
						`Expected 'first\\nsecond', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Shell command with environment variable substitution',
			test: async () => {
				const result = await runShellCommand('echo "Value is: $SUB_VAR"', {
					SUB_VAR: 'substituted',
				})
				if (result.stdout.trim() !== 'Value is: substituted') {
					throw new Error(
						`Expected 'Value is: substituted', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Shell command with special characters in env var',
			test: async () => {
				const result = await runShellCommand('echo "$SPECIAL_VAR"', {
					SPECIAL_VAR: 'test@#$%^&*()_+-=[]{}|;:,.<>?',
				})
				if (result.stdout.trim() !== 'test@#$%^&*()_+-=[]{}|;:,.<>?') {
					throw new Error(
						`Expected 'test@#$%^&*()_+-=[]{}|;:,.<>?', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Shell command with empty environment variable',
			test: async () => {
				const result = await runShellCommand(
					'echo "EMPTY:${EMPTY_VAR:-undefined}"',
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
			name: 'Shell command with conditional logic',
			test: async () => {
				const result = await runShellCommand(
					'if [ "$COND_VAR" = "true" ]; then echo "condition met"; else echo "condition not met"; fi',
					{ COND_VAR: 'true' },
				)
				if (result.stdout.trim() !== 'condition met') {
					throw new Error(
						`Expected 'condition met', got '${result.stdout.trim()}'`,
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

	console.log('✅ All cross-env-shell e2e tests passed!')
}

runTests().catch((error) => {
	console.error('❌ Test runner failed:', error)
	process.exit(1)
})
