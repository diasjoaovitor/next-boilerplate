import fs from 'node:fs'
import path from 'node:path'

const indexPath = path.resolve(
  import.meta.dirname,
  '../src/app/components/index.ts'
)

const generator = (plop) => {
  plop.setGenerator('component', {
    description: 'Create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your component name?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../src/app/components/{{kebabCase name}}/index.tsx',
        templateFile: 'templates/index.tsx.hbs'
      },
      {
        type: 'add',
        path: '../src/app/components/{{kebabCase name}}/{{kebabCase name}}.test.tsx',
        templateFile: 'templates/test.tsx.hbs'
      },
      () => {
        if (!fs.existsSync(indexPath)) {
          const directory = path.dirname(indexPath)
          fs.mkdirSync(directory, { recursive: true })
          fs.writeFileSync(indexPath, '')
        }
      },
      {
        type: 'append',
        path: '../src/app/components/index.ts',
        template: "export * from './{{kebabCase name}}'"
      },
      () => {
        const content = fs.readFileSync(indexPath, 'utf8')
        const lines = content.split('\n')
        const updatedContent =
          lines
            .filter((line) => line.trim() !== '')
            .toSorted()
            .join('\n') + '\n'
        fs.writeFileSync(indexPath, updatedContent)
      }
    ]
  })
}

export default generator
