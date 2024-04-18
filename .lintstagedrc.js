const path = require('path')

const buildEslintCommand = (filenames) => {
  const files = filenames.map((f) => path.relative(process.cwd(), f))
  return [
    `yarn prettier --write ${files.join(' --file ')}`,
    `next lint --fix --file ${files.join(' --file ')}`,
    `yarn jest --findRelatedTests ${files} --passWithNoTests`
  ]
}

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand]
}
