import path from 'node:path'

const buildCommand = (filenames) => {
  const files = filenames.map((file) => path.relative(process.cwd(), file))
  return [
    `pnpm exec prettier --write ${files.join(' ')}`,
    `pnpm exec eslint --fix ${files.join(' ')}`,
    `pnpm test --runInBand --findRelatedTests ${files.join(' ')} --passWithNoTests`
  ]
}

export default {
  '*.{js,jsx,ts,tsx,mjs,cjs,json,md,yml,yaml}': [buildCommand]
}
