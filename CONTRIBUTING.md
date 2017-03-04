# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub][egghead]

## Project setup

1. Fork and clone the repo
2. `$ npm install` to install dependencies
3. `$ npm start validate` to validate you've got it working
4. Create a branch for your PR

This project uses [`p-s`][p-s] and you can run `npm start` to see what scripts are available.

## Add yourself as a contributor

This project follows the [all contributors][all-contributors] specification. To add yourself to the table of
contributors on the README.md, please use the automated script as part of your PR:

```console
npm start addContributor <YOUR_GITHUB_USERNAME>
```

Follow the prompt. If you've already added yourself to the list and are making a new type of contribution, you can run
it again and select the added contribution type.

## Committing and Pushing changes

This project uses [`semantic-release`][semantic-release] to do automatic releases and generate a changelog based on the
commit history. So we follow [a convention][convention] for commit messages. Please follow this convention for your
commit messages.

You can use `commitizen` to help you to follow [the convention][convention]

Once you are ready to commit the changes, please use the below commands

1. `git add <files to be comitted>`
2. `$ npm start commit`

... and follow the instruction of the interactive prompt.

### opt into git hooks

There are git hooks set up with this project that are automatically installed when you install dependencies. They're
really handy, but are turned off by default (so as to not hinder new contributors). You can opt into these by creating
a file called `.opt-in` at the root of the project and putting this inside:

```
commit-msg
pre-commit
```

## Help needed

Please checkout the [ROADMAP.md][ROADMAP] and raise an issue to discuss
any of the items in the want to do or might do list.

Also, please watch the repo and respond to questions/bug reports/feature requests! Thanks!

[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[semantic-release]: https://npmjs.com/package/semantic-release
[convention]: https://github.com/conventional-changelog/conventional-changelog-angular/blob/ed32559941719a130bb0327f886d6a32a8cbc2ba/convention.md
[all-contributors]: https://github.com/kentcdodds/all-contributors
[ROADMAP]: ./other/ROADMAP.md
[p-s]: https://npmjs.com/package/p-s
