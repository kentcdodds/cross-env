<p align="center">
  <a href="https://codefund.io/properties/445/visit-sponsor">
    <img src="https://codefund.io/properties/445/sponsor" />
  </a>
</p>

<div align="center">
<h1>cross-env 🔀</h1>

Run scripts that set and use environment variables across platforms

</div>

<hr />

[![Travis Build Status][build-badge]][build]
[![AppVeyor Build Status][win-build-badge]][win-build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![node-version][node-version-badge]][node]
[![downloads][downloads-badge]][npm-stat]

[![MIT License][license-badge]][LICENSE]
[![All Contributors](https://img.shields.io/badge/all_contributors-20-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc]
[![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

Most Windows command prompts will choke when you set environment variables with
`NODE_ENV=production` like that. (The exception is [Bash on Windows][win-bash],
which uses native Bash.) Similarly, there's a difference in how windows and
POSIX commands utilize environment variables. With POSIX, you use: `$ENV_VAR`
and on windows you use `%ENV_VAR%`.

## This solution

`cross-env` makes it so you can have a single command without worrying about
setting or using the environment variable properly for the platform. Just set it
like you would if it's running on a POSIX system, and `cross-env` will take care
of setting it properly.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev cross-env
```

> WARNING! Make sure that when you're installing packages that you spell things
> correctly to avoid [mistakenly installing malware][malware]

> NOTE : Version 6 of cross-env only supports Node.js 8 and higher, to use it on Node.js 7 or lower install version 5
> ```npm install --save-dev cross-env@5 ```

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

The `NODE_ENV` environment variable will be set by `cross-env`

You can also split a command into several ones, or separate the environment
variables declaration from the actual command execution. You can do it this way:

```json
{
  "scripts": {
    "parentScript": "cross-env GREET=\"Joe\" npm run childScript",
    "childScript": "cross-env-shell \"echo Hello $GREET\""
  }
}
```

Where `childScript` holds the actual command to execute and `parentScript` sets
the environment variables to use. Then instead of run the childScript you run
the parent. This is quite useful for launching the same command with different
env variables or when the environment variables are too long to have everything
in one line.  It also means that you can use `$GREET` env var syntax even on
Windows which would usually require it to be `%GREET%`.

If you precede a dollar sign with an odd number of backslashes the expression statement will not be replaced. Note that this means backslashes after the JSON string escaping took place. `"FOO=\\$BAR"` will not be replaced. `"FOO=\\\\$BAR"` will be replaced though.

Lastly, if you want to pass a JSON string (e.g., when using [ts-loader]), you can do as follows:

```json
{
  "scripts": {
    "test": "cross-env TS_NODE_COMPILER_OPTIONS={\\\"module\\\":\\\"commonjs\\\"} node some_file.test.ts"
  }
}
```

Pay special attention to the **triple backslash** `(\\\)` **before** the **double quotes** `(")` and the **absence** of **single quotes** `(')`.
Both of these conditions have to be met in order to work both on Windows and UNIX.

## `cross-env` vs `cross-env-shell`

The `cross-env` module exposes two bins: `cross-env` and `cross-env-shell`. The
first one executes commands using [`cross-spawn`][cross-spawn], while the
second one uses the `shell` option from Node's `spawn`.

The main use case for `cross-env-shell` is when you need an environment
variable to be set across an entire inline shell script, rather than just one
command.

For example, if you want to have the environment variable apply to several
commands in series then you will need to wrap those in quotes and use 
`cross-env-shell` instead of `cross-env`.

```json
{
  "scripts": {
    "greet": "cross-env-shell GREETING=Hi NAME=Joe \"echo $GREETING && echo $NAME\""
  }
}
```

The rule of thumb is: if you want to pass to `cross-env` a command that
contains special shell characters *that you want interpreted*, then use
`cross-env-shell`. Otherwise stick to `cross-env`.

On Windows you need to use `cross-env-shell`, if you want to handle [signal events](https://nodejs.org/api/process.html#process_signal_events) inside of your program. A common case for that is when you want to capture a `SIGINT` event invoked by pressing `Ctrl + C` on the command-line interface.

## Windows Issues

Please note that `npm` uses `cmd` by default and that doesn't support command
substitution, so if you want to leaverage that, then you need to update your
`.npmrc` to set the `script-shell` to powershell.
[Learn more here](https://github.com/kentcdodds/cross-env/issues/192#issuecomment-513341729).

## Inspiration

I originally created this to solve a problem I was having with my npm scripts in
[angular-formly][angular-formly]. This made contributing to the project
much easier for Windows users.

## Other Solutions

- [`env-cmd`](https://github.com/toddbluhm/env-cmd) - Reads environment variables from a file instead
- [`@naholyr/cross-env`](https://www.npmjs.com/package/@naholyr/cross-env) - `cross-env` with support for setting default values

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt="Kent C. Dodds"/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://zhuangya.me"><img src="https://avatars1.githubusercontent.com/u/499038?v=3" width="100px;" alt="Ya Zhuang "/><br /><sub><b>Ya Zhuang </b></sub></a><br /><a href="#plugin-zhuangya" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=zhuangya" title="Documentation">📖</a></td>
    <td align="center"><a href="https://wopian.me"><img src="https://avatars3.githubusercontent.com/u/3440094?v=3" width="100px;" alt="James Harris"/><br /><sub><b>James Harris</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=wopian" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/compumike08"><img src="https://avatars1.githubusercontent.com/u/8941730?v=3" width="100px;" alt="compumike08"/><br /><sub><b>compumike08</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Acompumike08" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=compumike08" title="Documentation">📖</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=compumike08" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/danielo515"><img src="https://avatars1.githubusercontent.com/u/2270425?v=3" width="100px;" alt="Daniel Rodríguez Rivero"/><br /><sub><b>Daniel Rodríguez Rivero</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Adanielo515" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=danielo515" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=danielo515" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/inyono"><img src="https://avatars2.githubusercontent.com/u/1508477?v=3" width="100px;" alt="Jonas Keinholz"/><br /><sub><b>Jonas Keinholz</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Ainyono" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=inyono" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=inyono" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/hgwood"><img src="https://avatars3.githubusercontent.com/u/1656170?v=3" width="100px;" alt="Hugo Wood"/><br /><sub><b>Hugo Wood</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Ahgwood" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=hgwood" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=hgwood" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/thomasthiebaud"><img src="https://avatars0.githubusercontent.com/u/3715715?v=3" width="100px;" alt="Thiebaud Thomas"/><br /><sub><b>Thiebaud Thomas</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Athomasthiebaud" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=thomasthiebaud" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=thomasthiebaud" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://daniel.blog"><img src="https://avatars1.githubusercontent.com/u/1715800?v=3" width="100px;" alt="Daniel Rey López"/><br /><sub><b>Daniel Rey López</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=DanReyLop" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=DanReyLop" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://amilajack.com"><img src="https://avatars2.githubusercontent.com/u/6374832?v=3" width="100px;" alt="Amila Welihinda"/><br /><sub><b>Amila Welihinda</b></sub></a><br /><a href="#infra-amilajack" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://twitter.com/paulcbetts"><img src="https://avatars1.githubusercontent.com/u/1396?v=3" width="100px;" alt="Paul Betts"/><br /><sub><b>Paul Betts</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Apaulcbetts" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=paulcbetts" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/turnerhayes"><img src="https://avatars1.githubusercontent.com/u/6371670?v=3" width="100px;" alt="Turner Hayes"/><br /><sub><b>Turner Hayes</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Aturnerhayes" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=turnerhayes" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=turnerhayes" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/sudo-suhas"><img src="https://avatars2.githubusercontent.com/u/22251956?v=4" width="100px;" alt="Suhas Karanth"/><br /><sub><b>Suhas Karanth</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=sudo-suhas" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=sudo-suhas" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/sventschui"><img src="https://avatars3.githubusercontent.com/u/512692?v=4" width="100px;" alt="Sven"/><br /><sub><b>Sven</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=sventschui" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=sventschui" title="Documentation">📖</a> <a href="#example-sventschui" title="Examples">💡</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=sventschui" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/NicoZelaya"><img src="https://avatars0.githubusercontent.com/u/5522668?v=4" width="100px;" alt="D. Nicolás Lopez Zelaya"/><br /><sub><b>D. Nicolás Lopez Zelaya</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=NicoZelaya" title="Code">💻</a></td>
    <td align="center"><a href="http://bithavoc.io"><img src="https://avatars3.githubusercontent.com/u/219289?v=4" width="100px;" alt="Johan Hernandez"/><br /><sub><b>Johan Hernandez</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=bithavoc" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jnielson94"><img src="https://avatars3.githubusercontent.com/u/13559161?v=4" width="100px;" alt="Jordan Nielson"/><br /><sub><b>Jordan Nielson</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Ajnielson94" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=jnielson94" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=jnielson94" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://nz.linkedin.com/in/jsonc11"><img src="https://avatars0.githubusercontent.com/u/5185660?v=4" width="100px;" alt="Jason Cooke"/><br /><sub><b>Jason Cooke</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=Jason-Cooke" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/bibo5088"><img src="https://avatars0.githubusercontent.com/u/17709887?v=4" width="100px;" alt="bibo5088"/><br /><sub><b>bibo5088</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=bibo5088" title="Code">💻</a></td>
    <td align="center"><a href="https://codefund.io"><img src="https://avatars2.githubusercontent.com/u/12481?v=4" width="100px;" alt="Eric Berry"/><br /><sub><b>Eric Berry</b></sub></a><br /><a href="#fundingFinding-coderberry" title="Funding Finding">🔍</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

> Note: this was added late into the project. If you've contributed to this
> project in any way, please make a pull request to add yourself to the list
> by following the instructions in the `CONTRIBUTING.md`

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/cross-env.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/cross-env
[win-build-badge]: https://img.shields.io/appveyor/ci/kentcdodds/cross-env.svg?style=flat-square
[win-build]: https://ci.appveyor.com/project/kentcdodds/cross-env
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/cross-env.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/cross-env
[dependencyci-badge]: https://dependencyci.com/github/kentcdodds/cross-env/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/kentcdodds/cross-env
[version-badge]: https://img.shields.io/npm/v/cross-env.svg?style=flat-square
[package]: https://www.npmjs.com/package/cross-env
[node-version-badge]: https://img.shields.io/badge/node-%3E%3D%204.0-orange.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/cross-env.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=cross-env&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/cross-env.svg?style=flat-square
[license]: https://github.com/kentcdodds/cross-env/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/cross-env/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]: https://github.com/kentcdodds/cross-env/blob/master/other/ROADMAP.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/kentcdodds/cross-env/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/cross-env.svg?style=social
[github-watch]: https://github.com/kentcdodds/cross-env/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/cross-env.svg?style=social
[github-star]: https://github.com/kentcdodds/cross-env/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20cross-env!%20https://github.com/kentcdodds/cross-env%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/cross-env.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[win-bash]: https://msdn.microsoft.com/en-us/commandline/wsl/about
[angular-formly]: https://github.com/formly-js/angular-formly
[cross-spawn]: https://www.npmjs.com/package/cross-spawn
[ts-loader]: https://www.npmjs.com/package/ts-loader
[malware]: http://blog.npmjs.org/post/163723642530/crossenv-malware-on-the-npm-registry
