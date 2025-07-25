import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*'],
			exclude: [
				'node_modules/',
				'dist/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/coverage/**',
				'**/*.test.ts',
				'**/*.spec.ts',
				'**/src/bin/**', // covered by e2e
				'**/__tests__/**',
			],
		},
	},
})
