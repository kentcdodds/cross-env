#!/usr/bin/env node

/**
 * Clean CJS files from the dist directory and update package.json types paths.
 *
 * This script removes .cjs and .d.cts files after zshy builds them,
 * and updates package.json to use .d.ts files for types instead of .d.cts.
 * This is a workaround until zshy supports ESM-only builds.
 *
 * See: https://github.com/colinhacks/zshy/issues/21
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function cleanCjsFiles(dir) {
	try {
		// Check if directory exists
		await fs.access(dir)
	} catch (error) {
		console.error(
			`Directory does not exist or is not accessible: ${dir}`,
			error,
		)
		return
	}

	try {
		const items = await fs.readdir(dir, { withFileTypes: true })

		for (const item of items) {
			const fullPath = path.join(dir, item.name)

			if (item.isDirectory()) {
				await cleanCjsFiles(fullPath)
			} else if (item.name.endsWith('.cjs') || item.name.endsWith('.d.cts')) {
				try {
					console.log(`Deleting: ${fullPath}`)
					await fs.unlink(fullPath)
				} catch (error) {
					console.error(`Failed to delete ${fullPath}:`, error.message)
				}
			}
		}
	} catch (error) {
		console.error(`Failed to read directory ${dir}:`, error.message)
	}
}

async function updatePackageJsonTypes() {
	const packageJsonPath = path.join(__dirname, '..', 'package.json')

	try {
		const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8')
		const packageJson = JSON.parse(packageJsonContent)

		// Update the main field from .cjs to .js
		if (packageJson.main && packageJson.main.endsWith('.cjs')) {
			packageJson.main = packageJson.main.replace('.cjs', '.js')
			console.log(`Updated main: ${packageJson.main}`)
		}

		// Update the main types field
		if (packageJson.types && packageJson.types.endsWith('.d.cts')) {
			packageJson.types = packageJson.types.replace('.d.cts', '.d.ts')
			console.log(`Updated main types: ${packageJson.types}`)
		}

		// Update types in exports and remove require properties
		if (packageJson.exports) {
			for (const [key, value] of Object.entries(packageJson.exports)) {
				if (typeof value === 'object') {
					// Update types from .d.cts to .d.ts
					if (value.types && value.types.endsWith('.d.cts')) {
						value.types = value.types.replace('.d.cts', '.d.ts')
						console.log(`Updated types for ${key}: ${value.types}`)
					}

					// Remove require properties since we're deleting CJS files
					if (value.require) {
						delete value.require
						console.log(`Removed require for ${key}`)
					}
				}
			}
		}

		// Write the updated package.json back
		await fs.writeFile(
			packageJsonPath,
			JSON.stringify(packageJson, null, 2) + '\n',
		)
		console.log(
			'Updated package.json types paths and removed require properties',
		)
	} catch (error) {
		console.error('Failed to update package.json:', error.message)
		throw error
	}
}

async function main() {
	try {
		// Clean the dist directory
		const distPath = path.join(__dirname, '..', 'dist')
		console.log('Cleaning CJS files from:', distPath)
		await cleanCjsFiles(distPath)
		console.log('Clean complete!')

		// Update package.json types paths
		console.log('Updating package.json types paths...')
		await updatePackageJsonTypes()
		console.log('Update complete!')
	} catch (error) {
		console.error('Script failed:', error.message)
		process.exit(1)
	}
}

main()
