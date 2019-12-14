module.exports = (api, options) => {
	function findFileInNamed (files, name) {
		const searchName = `/${name.toLowerCase()}`
		return Object.keys(files).find(fileName => fileName.toLowerCase().includes(searchName))
	}

	api.extendPackage({
		postcss: undefined,

		devDependencies: {
			"@fullhuman/postcss-purgecss": "^1.3.0",
			"tailwindcss": "^1.1.4",
		},
	})

	api.render('./templates', options)

	api.postProcessFiles(files => {
		const appFileName = findFileInNamed(files, 'main.js')
		const appFileString = files[appFileName]

		const importStatement = `\nimport '@/assets/tailwind.css'\n\n`
		const lines = appFileString.split(/\r?\n/g)
		const productionTip = lines.findIndex(line => line.startsWith('Vue.config.productionTip'))

		if (productionTip !== -1) {
			lines[productionTip] = importStatement + lines[productionTip]
		}

		files[appFileName] = lines.join('\n')
	})
}
