import { type SpawnOptions, type ChildProcess } from 'child_process'
import { x } from 'tinyexec'

/**
 * Tinyexec's `x` method wrapper for make it like `child_process.spawn`.
 * @param cmd Command name
 * @param args Command arguments
 * @param nodeOptions Spawn options
 * @returns Spawn instance
 */
export function spawn(
	cmd: string,
	args?: string[],
	nodeOptions?: SpawnOptions,
) {
	return x(cmd, args, { nodeOptions }).process as ChildProcess
}
