const fs = require('fs')
const path = require('path')

module.exports = (plop) => {
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
        path: '../src/app/components/{{pascalCase name}}/index.tsx',
        templateFile: 'templates/index.tsx.hbs'
      },
      {
        type: 'add',
        path: '../src/app/components/{{pascalCase name}}/{{kebabCase name}}.test.tsx',
        templateFile: 'templates/test.tsx.hbs'
      },
      {
        type: 'append',
        path: '../src/app/components/index.ts',
        template: "export * from './{{pascalCase name}}'",
        separator: ''
      },
      () => {
        const indexPath = path.resolve(
          __dirname,
          '../src/app/components/index.ts'
        )
        const content = fs.readFileSync(indexPath, 'utf-8')
        const lines = content.split('\n')
        const updatedContent =
          lines
            .filter((line) => line.trim() !== '')
            .sort()
            .join('\n') + '\n'
        fs.writeFileSync(indexPath, updatedContent)
      }
    ]
  })
}
