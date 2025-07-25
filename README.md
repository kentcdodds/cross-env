# cross-env 🔀

Run scripts that set and use environment variables across platforms.

## The Problem

Most Windows command prompts will choke when you set environment variables with
`NODE_ENV=production` like that. Similarly, there's a difference in how Windows
and POSIX commands utilize environment variables. With POSIX, you use:
`$ENV_VAR` and on Windows you use `%ENV_VAR%`.

## The Solution

`cross-env` makes it so you can have a single command without worrying about
setting or using the environment variable properly for the platform. Just set it
like you would if it's running on a POSIX system, and `cross-env` will take care
of setting it properly.

## Installation

```bash
npm install --save-dev cross-env
```

## Usage

I use this in my npm scripts:

```json
{
	"scripts": {
		"build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
	}
}
```

Ultimately, the command that is executed (using [`cross-spawn`][cross-spawn])
is:

```
webpack --config build/webpack.config.js
```

The `NODE_ENV` environment variable will be set by `cross-env`.

### Multiple Environment Variables

You can set multiple environment variables at a time:

```json
{
	"scripts": {
		"build": "cross-env FIRST_ENV=one SECOND_ENV=two node ./my-program"
	}
}
```

### Complex Commands

You can also split a command into several ones, or separate the environment
variables declaration from the actual command execution:

```json
{
	"scripts": {
		"parentScript": "cross-env GREET=\"Joe\" npm run childScript",
		"childScript": "cross-env-shell \"echo Hello $GREET\""
	}
}
```

### JSON Strings

For JSON strings (e.g., when using [ts-loader]):

```json
{
	"scripts": {
		"test": "cross-env TS_NODE_COMPILER_OPTIONS={\\\"module\\\":\\\"commonjs\\\"} node some_file.test.ts"
	}
}
```

Pay special attention to the **triple backslash** `(\\\)` **before** the
**double quotes** `(")` and the **absence** of **single quotes** `(')`.

## `cross-env` vs `cross-env-shell`

The `cross-env` module exposes two bins: `cross-env` and `cross-env-shell`.

- **`cross-env`**: Executes commands using [`cross-spawn`][cross-spawn]
- **`cross-env-shell`**: Uses the `shell` option from Node's `spawn`

Use `cross-env-shell` when you need an environment variable to be set across an
entire inline shell script, rather than just one command:

```json
{
	"scripts": {
		"greet": "cross-env-shell GREETING=Hi NAME=Joe \"echo $GREETING && echo $NAME\""
	}
}
```

**Rule of thumb**: If you want to pass to `cross-env` a command that contains
special shell characters _that you want interpreted_, then use
`cross-env-shell`. Otherwise stick to `cross-env`.

## Windows Issues

Please note that `npm` uses `cmd` by default and that doesn't support command
substitution, so if you want to leverage that, then you need to update your
`.npmrc` to set the `script-shell` to powershell.

## Requirements

- Node.js >= 20

## License

MIT

<!-- prettier-ignore-start -->
[cross-spawn]: https://www.npmjs.com/package/cross-spawn
[ts-loader]: https://www.npmjs.com/package/ts-loader
<!-- prettier-ignore-end -->
