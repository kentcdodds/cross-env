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

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function cleanCjsFiles(dir) {
	if (!fs.existsSync(dir)) {
		return
	}

	const items = fs.readdirSync(dir, { withFileTypes: true })

	for (const item of items) {
		const fullPath = path.join(dir, item.name)

		if (item.isDirectory()) {
			cleanCjsFiles(fullPath)
		} else if (item.name.endsWith('.cjs') || item.name.endsWith('.d.cts')) {
			console.log(`Deleting: ${fullPath}`)
			fs.unlinkSync(fullPath)
		}
	}
}

function updatePackageJsonTypes() {
	const packageJsonPath = path.join(__dirname, '..', 'package.json')
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

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
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
	console.log('Updated package.json types paths and removed require properties')
}

// Clean the dist directory
const distPath = path.join(__dirname, '..', 'dist')
console.log('Cleaning CJS files from:', distPath)
cleanCjsFiles(distPath)
console.log('Clean complete!')

// Update package.json types paths
console.log('Updating package.json types paths...')
updatePackageJsonTypes()
console.log('Update complete!')
