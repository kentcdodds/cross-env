#!/usr/bin/env node

/**
 * Clean CJS files from the dist directory.
 *
 * This script removes .cjs and .d.cts files after zshy builds them.
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

// Clean the dist directory
const distPath = path.join(__dirname, '..', 'dist')
console.log('Cleaning CJS files from:', distPath)
cleanCjsFiles(distPath)
console.log('Clean complete!')
