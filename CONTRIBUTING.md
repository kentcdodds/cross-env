# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this _free_
series [How to Contribute to an Open Source Project on GitHub][egghead]

## Project setup

1. Fork and clone the repo
2. `npm install` to install dependencies
3. `npm run validate` to validate you've got it working
4. Create a branch for your PR

> Tip: Keep your `main` branch pointing at the original repository and make pull
> requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/kentcdodds/cross-env.git
> git fetch upstream
> git branch --set-upstream-to=upstream/main main
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `main` branch
> to use the upstream main branch whenever you run `git pull`. Then you can make
> all of your pull request branches based on this `main` branch. Whenever you
> want to update your version of `main`, do a regular `git pull`.

## Development

This project uses modern tooling:

- **TypeScript** for type safety
- **Vitest** for testing
- **ESLint** for linting
- **Prettier** for formatting
- **zshy** for building

### Available Scripts

- `npm run build` - Build the project
- `npm run dev` - Build in watch mode
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - Run TypeScript type checking
- `npm run validate` - Run all checks (build, typecheck, lint, format, test)

## Help needed

Please checkout the [the open issues][issues]

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

## Contributors ✨

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://zhuangya.me"><img src="https://avatars1.githubusercontent.com/u/499038?v=3" width="100px;" alt=""/><br /><sub><b>Ya Zhuang </b></sub></a><br /><a href="#plugin-zhuangya" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=zhuangya" title="Documentation">📖</a></td>
    <td align="center"><a href="https://wopian.me"><img src="https://avatars3.githubusercontent.com/u/3440094?v=3" width="100px;" alt=""/><br /><sub><b>James Harris</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=wopian" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/compumike08"><img src="https://avatars1.githubusercontent.com/u/8941730?v=3" width="100px;" alt=""/><br /><sub><b>compumike08</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Acompumike08" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=compumike08" title="Documentation">📖</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=compumike08" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/danielo515"><img src="https://avatars1.githubusercontent.com/u/2270425?v=3" width="100px;" alt=""/><br /><sub><b>Daniel Rodríguez Rivero</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Adanielo515" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=danielo515" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=danielo515" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/inyono"><img src="https://avatars2.githubusercontent.com/u/1508477?v=3" width="100px;" alt=""/><br /><sub><b>Jonas Keinholz</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Ainyono" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=inyono" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=inyono" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/hgwood"><img src="https://avatars3.githubusercontent.com/u/1656170?v=3" width="100px;" alt=""/><br /><sub><b>Hugo Wood</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Ahgwood" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=hgwood" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=hgwood" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/thomasthiebaud"><img src="https://avatars0.githubusercontent.com/u/3715715?v=3" width="100px;" alt=""/><br /><sub><b>Thiebaud Thomas</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Athomasthiebaud" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=thomasthiebaud" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=thomasthiebaud" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://daniel.blog"><img src="https://avatars1.githubusercontent.com/u/1715800?v=3" width="100px;" alt=""/><br /><sub><b>Daniel Rey López</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=DanReyLop" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=DanReyLop" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://amilajack.com"><img src="https://avatars2.githubusercontent.com/u/6374832?v=3" width="100px;" alt=""/><br /><sub><b>Amila Welihinda</b></sub></a><br /><a href="#infra-amilajack" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://twitter.com/paulcbetts"><img src="https://avatars1.githubusercontent.com/u/1396?v=3" width="100px;" alt=""/><br /><sub><b>Paul Betts</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Apaulcbetts" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=paulcbetts" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/turnerhayes"><img src="https://avatars1.githubusercontent.com/u/6371670?v=3" width="100px;" alt=""/><br /><sub><b>Turner Hayes</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Aturnerhayes" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=turnerhayes" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=turnerhayes" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/sudo-suhas"><img src="https://avatars2.githubusercontent.com/u/22251956?v=4" width="100px;" alt=""/><br /><sub><b>Suhas Karanth</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=sudo-suhas" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=sudo-suhas" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/sventschui"><img src="https://avatars3.githubusercontent.com/u/512692?v=4" width="100px;" alt=""/><br /><sub><b>Sven</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=sventschui" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=sventschui" title="Documentation">📖</a> <a href="#example-sventschui" title="Examples">💡</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=sventschui" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/NicoZelaya"><img src="https://avatars0.githubusercontent.com/u/5522668?v=4" width="100px;" alt=""/><br /><sub><b>D. Nicolás Lopez Zelaya</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=NicoZelaya" title="Code">💻</a></td>
    <td align="center"><a href="http://bithavoc.io"><img src="https://avatars3.githubusercontent.com/u/219289?v=4" width="100px;" alt=""/><br /><sub><b>Johan Hernandez</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=bithavoc" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jnielson94"><img src="https://avatars3.githubusercontent.com/u/13559161?v=4" width="100px;" alt=""/><br /><sub><b>Jordan Nielson</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/issues?q=author%3Ajnielson94" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=jnielson94" title="Code">💻</a> <a href="https://github.com/kentcdodds/cross-env/commits?author=jnielson94" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://nz.linkedin.com/in/jsonc11"><img src="https://avatars0.githubusercontent.com/u/5185660?v=4" width="100px;" alt=""/><br /><sub><b>Jason Cooke</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=Jason-Cooke" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/bibo5088"><img src="https://avatars0.githubusercontent.com/u/17709887?v=4" width="100px;" alt=""/><br /><sub><b>bibo5088</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=bibo5088" title="Code">💻</a></td>
    <td align="center"><a href="https://codefund.io"><img src="https://avatars2.githubusercontent.com/u/12481?v=4" width="100px;" alt=""/><br /><sub><b>Eric Berry</b></sub></a><br /><a href="#fundingFinding-coderberry" title="Funding Finding">🔍</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4" width="100px;" alt=""/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=MichaelDeBoey" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/lauriii"><img src="https://avatars0.githubusercontent.com/u/1845495?v=4" width="100px;" alt=""/><br /><sub><b>Lauri Eskola</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=lauriii" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/devuxer"><img src="https://avatars0.githubusercontent.com/u/1298521?v=4" width="100px;" alt=""/><br /><sub><b>devuxer</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=devuxer" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/dsbert"><img src="https://avatars2.githubusercontent.com/u/1320090?v=4" width="100px;" alt=""/><br /><sub><b>Daniel</b></sub></a><br /><a href="https://github.com/kentcdodds/cross-env/commits?author=dsbert" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

[egghead]:
	https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[all-contributors]: https://github.com/all-contributors/all-contributors
[emojis]: https://allcontributors.org/docs/en/emoji-key
[issues]: https://github.com/kentcdodds/cross-env/issues
