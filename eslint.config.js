import config from '@epic-web/config/eslint'

export default [
	...config,
	{
		ignores: ['dist/**', 'coverage/**'],
	},
]
