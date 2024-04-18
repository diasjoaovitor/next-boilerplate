const path = require('path')

const buildEslintCommand = (filenames) => {
  const files = filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')
  return [`yarn prettier --write ${files}`, `next lint --fix --file ${files}`]
}

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand]
}
