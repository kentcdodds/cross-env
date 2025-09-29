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

async function runTests() {
	console.log('🧪 Running cross-env default value syntax e2e tests...')

	const tests = [
		{
			name: 'Default value syntax when variable is undefined',
			test: async () => {
				// Test that the command conversion works by using echo to see the converted command
				const result = await runCommand(crossEnvPath, [
					'echo',
					'wrangler dev --port ${PORT:-8787}',
				])

				// On Windows, this should convert to the default value
				// On Unix, it should remain unchanged
				const expected =
					process.platform === 'win32'
						? 'wrangler dev --port 8787'
						: 'wrangler dev --port ${PORT:-8787}'
				if (result.stdout.trim() !== expected) {
					throw new Error(
						`Expected '${expected}', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Default value syntax when variable is defined',
			test: async () => {
				const result = await runCommand(crossEnvPath, [
					'PORT=3000',
					'echo',
					'wrangler dev --port ${PORT:-8787}',
				])

				// On Windows, this should convert to the defined value
				// On Unix, it should remain unchanged
				const expected =
					process.platform === 'win32'
						? 'wrangler dev --port 3000'
						: 'wrangler dev --port ${PORT:-8787}'
				if (result.stdout.trim() !== expected) {
					throw new Error(
						`Expected '${expected}', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Multiple default value syntaxes',
			test: async () => {
				const result = await runCommand(crossEnvPath, [
					'HOST=localhost',
					'echo',
					'wrangler dev --host ${HOST:-0.0.0.0} --port ${PORT:-8787}',
				])

				// On Windows, should use defined value for HOST and default for PORT
				// On Unix, should remain unchanged
				const expected =
					process.platform === 'win32'
						? 'wrangler dev --host localhost --port 8787'
						: 'wrangler dev --host ${HOST:-0.0.0.0} --port ${PORT:-8787}'
				if (result.stdout.trim() !== expected) {
					throw new Error(
						`Expected '${expected}', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Default value with special characters',
			test: async () => {
				const result = await runCommand(crossEnvPath, [
					'echo',
					'node app.js --env ${NODE_ENV:-development}',
				])

				// On Windows, should use the default value
				// On Unix, should remain unchanged
				const expected =
					process.platform === 'win32'
						? 'node app.js --env development'
						: 'node app.js --env ${NODE_ENV:-development}'
				if (result.stdout.trim() !== expected) {
					throw new Error(
						`Expected '${expected}', got '${result.stdout.trim()}'`,
					)
				}
			},
		},
		{
			name: 'Default value with spaces',
			test: async () => {
				const result = await runCommand(crossEnvPath, [
					'echo',
					'echo ${MESSAGE:-hello world}',
				])

				// On Windows, should use the default value with spaces
				// On Unix, should remain unchanged
				const expected =
					process.platform === 'win32'
						? 'echo hello world'
						: 'echo ${MESSAGE:-hello world}'
				if (result.stdout.trim() !== expected) {
					throw new Error(
						`Expected '${expected}', got '${result.stdout.trim()}'`,
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

	console.log('✅ All default value syntax e2e tests passed!')
}

runTests().catch((error) => {
	console.error('❌ Test runner failed:', error)
	process.exit(1)
})
