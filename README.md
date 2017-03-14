# cross-env

Run scripts that set and use environment variables across platforms

[![Travis Build Status][build-badge]][build]
[![AppVeyor Build Status][win-build-badge]][win-build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]

[![MIT License][license-badge]][LICENSE]
[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors)
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

## Prerequisites

- [NodeJS][node] version 4.0 or greater.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
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

Ultimately, the command that is executed (using `cross-spawn`) is:

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
    "childScript": "echo Hello $GREET"
  }
}
```

Where `childScript` holds the actual command to execute and `parentScript` sets
the environment variables to use. Then instead of run the childScript you run
the parent. This is quite useful for launching the same command with different
env variables or when the environment variables are too long to have everything
in one line.

## Inspiration

I originally created this to solve a problem I was having with my npm scripts in
[angular-formly][angular-formly]. This made it made contributing to the project
much easier for windows users.

## Other Solutions

- [`env-cmd`](https://github.com/toddbluhm/env-cmd) - Reads environment variables from a file instead

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/cross-env/commits?author=kentcdodds) [📖](https://github.com/kentcdodds/cross-env/commits?author=kentcdodds) 🚇 [⚠️](https://github.com/kentcdodds/cross-env/commits?author=kentcdodds) | [<img src="https://avatars1.githubusercontent.com/u/499038?v=3" width="100px;"/><br /><sub>Ya Zhuang </sub>](https://zhuangya.me)<br />🔌 [📖](https://github.com/kentcdodds/cross-env/commits?author=zhuangya) | [<img src="https://avatars3.githubusercontent.com/u/3440094?v=3" width="100px;"/><br /><sub>James Harris</sub>](https://wopian.me)<br />[📖](https://github.com/kentcdodds/cross-env/commits?author=wopian) | [<img src="https://avatars1.githubusercontent.com/u/8941730?v=3" width="100px;"/><br /><sub>compumike08</sub>](https://github.com/compumike08)<br />[🐛](https://github.com/kentcdodds/cross-env/issues?q=author%3Acompumike08) [📖](https://github.com/kentcdodds/cross-env/commits?author=compumike08) [⚠️](https://github.com/kentcdodds/cross-env/commits?author=compumike08) | [<img src="https://avatars1.githubusercontent.com/u/2270425?v=3" width="100px;"/><br /><sub>Daniel Rodríguez Rivero</sub>](https://github.com/danielo515)<br />[🐛](https://github.com/kentcdodds/cross-env/issues?q=author%3Adanielo515) [💻](https://github.com/kentcdodds/cross-env/commits?author=danielo515) [📖](https://github.com/kentcdodds/cross-env/commits?author=danielo515) | [<img src="https://avatars2.githubusercontent.com/u/1508477?v=3" width="100px;"/><br /><sub>Jonas Keinholz</sub>](https://github.com/inyono)<br />[🐛](https://github.com/kentcdodds/cross-env/issues?q=author%3Ainyono) [💻](https://github.com/kentcdodds/cross-env/commits?author=inyono) [⚠️](https://github.com/kentcdodds/cross-env/commits?author=inyono) | [<img src="https://avatars3.githubusercontent.com/u/1656170?v=3" width="100px;"/><br /><sub>Hugo Wood</sub>](https://github.com/hgwood/blog)<br />[🐛](https://github.com/kentcdodds/cross-env/issues?q=author%3Ahgwood) [💻](https://github.com/kentcdodds/cross-env/commits?author=hgwood) [⚠️](https://github.com/kentcdodds/cross-env/commits?author=hgwood) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
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
