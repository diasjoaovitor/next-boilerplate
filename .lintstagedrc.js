const path = require('path')

const buildEslintCommand = (filenames) => {
  const files = filenames.map((f) => path.relative(process.cwd(), f))
  return [
    `npx prettier --write ${files.join(' --file ')}`,
    `next lint --fix --file ${files.join(' --file ')}`,
    `npx jest --findRelatedTests ${files.join(' ')} --passWithNoTests`
  ]
}

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand]
}
