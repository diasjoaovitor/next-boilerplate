# Como criar um boilerplate para projetos com Next.js

## Parte 1 — Projeto, padrão de código e Git hooks

Vou mostrar o passo a passo de como realizar todas as configurações que utilizo nos meus projetos com [Next.js](https://nextjs.org/). O resultado final está no repositório [next-boilerplate](https://github.com/diasjoaovitor/next-boilerplate), aberto a contribuições.

Baseado no [boilerplate-apps-router](https://github.com/React-Avancado/boilerplate-apps-router) do curso [React Avançado](https://reactavancado.com.br/).

Reescrevi este tutorial do zero, porque o anterior usava npm, Jest e `next lint`, que não fazem mais parte do projeto. Agora ele está dividido em duas partes: aqui ficam o projeto, o padrão de código e os Git hooks. Na Parte 2 ficam o Tailwind com shadcn/ui, os testes e a configuração para agentes de IA.

Você precisa de [Git](https://git-scm.com/), [nvm](https://github.com/nvm-sh/nvm), [pnpm](https://pnpm.io/installation) e [VSCode](https://code.visualstudio.com/). Testei todos os passos em Linux, e o mesmo vale para o WSL (escrevi [esse tutorial](https://www.tabnews.com.br/diasjoaovitor/tutorial-como-configurar-um-ambiente-de-desenvolvimento-com-o-wsl) sobre como configurar o `WSL`). No macOS, o `sed -i` dos comandos abaixo precisa ser `sed -i ''`. Os comandos são executados na raiz do projeto.

### 1. Criar o projeto

```bash
pnpm create next-app@latest next-boilerplate --ts --tailwind --eslint --app --src-dir --react-compiler --import-alias "@/*" --use-pnpm --agents-md
cd next-boilerplate
```

- `--ts`, `--tailwind`, `--eslint` e `--app`: TypeScript, Tailwind CSS, ESLint e App Router.
- `--src-dir`: o código fica dentro de `src/`.
- `--react-compiler`: habilita o [React Compiler](https://react.dev/learn/react-compiler).
- `--import-alias "@/*"`: `@/` aponta para `src/`.
- `--use-pnpm`: usa o pnpm como gerenciador de pacotes.
- `--agents-md`: gera o `AGENTS.md` e o `CLAUDE.md`, com instruções para agentes de IA.

O comando já inicializa o Git e faz o primeiro commit.

Os arquivos de configuração que vamos criar usam `import`/`export`, então marque o projeto como ESM:

```bash
pnpm pkg set type=module
```

### 2. Especificar a versão do Node

Crie o arquivo `.nvmrc` e adicione a versão a ser utilizada:

```text
lts/krypton
```

O `lts/krypton` é o Node 24. **É obrigatório** deixar uma linha em branco ao final do arquivo para que essa configuração funcione. Depois instale e use essa versão:

```sh
nvm install
```

### 3. Fixar as versões exatas

O `create-next-app` deixa algumas dependências com faixas de versão (`^`). Prefiro versões exatas, para que a instalação seja reproduzível. O `pnpm add -E <pacote>` grava a versão exata, mas só quando você não informa a versão. Com `pacote@6` ou `pacote@latest`, e com pacotes que já estão no `package.json`, ele grava `^` mesmo com o `-E`. Então instale as versões que quer e remova os `^` em seguida:

```bash
pnpm add next@latest react@latest react-dom@latest
pnpm add -D @tailwindcss/postcss@latest tailwindcss@latest @types/react@latest @types/react-dom@latest @types/node@24 typescript@6 eslint@9
sed -i -E 's/"\^([0-9])/"\1/' package.json
pnpm install
```

- O `sed` remove o `^` das versões do `package.json` e o `pnpm install` atualiza o `pnpm-lock.yaml`.
- `@types/node@24` acompanha o Node do `.nvmrc`.
- `typescript@6` e `eslint@9` são as majors com as quais validei todo o conjunto de ferramentas deste tutorial.

A partir daqui, instale os pacotes com `pnpm add -E <pacote>` (ou `pnpm add -D -E <pacote>`) e nunca edite as versões à mão. Quando precisar informar a versão, rode o `sed` e o `pnpm install` acima depois da instalação. O campo `packageManager` do `package.json` já foi preenchido pelo `create-next-app` com a sua versão do pnpm, e o CI vai ler a versão de lá.

### 4. Configurar o commit linter

Instale o [husky](https://typicode.github.io/husky/) e o [commitlint](https://commitlint.js.org/) com a [convenção de emojis](https://www.npmjs.com/package/commitlint-config-emoji-convention):

```bash
pnpm add -D -E husky @commitlint/cli commitlint-config-emoji-convention
pnpm exec husky init
```

O `husky init` criou o script `prepare` no `package.json` e a pasta `.husky`.

Crie o arquivo `commitlint.config.js`:

```js
export default { extends: ['emoji-convention'] }
```

Crie o arquivo `.husky/commit-msg`:

```sh
msg=$(cat "$1")

msg=$(echo "$msg" | grep -v "^#")

msg=$(echo "$msg" | sed -e "s/^init/🎉 init/")
msg=$(echo "$msg" | sed -e "s/^feat/✨ feat/")
msg=$(echo "$msg" | sed -e "s/^fix/🐛 fix/")
msg=$(echo "$msg" | sed -e "s/^docs/📚 docs/")
msg=$(echo "$msg" | sed -e "s/^style/💎 style/")
msg=$(echo "$msg" | sed -e "s/^refactor/📦 refactor/")
msg=$(echo "$msg" | sed -e "s/^perf/🚀 perf/")
msg=$(echo "$msg" | sed -e "s/^test/🚨 test/")
msg=$(echo "$msg" | sed -e "s/^build/🛠 build/")
msg=$(echo "$msg" | sed -e "s/^ci/⚙️ ci/")
msg=$(echo "$msg" | sed -e "s/^chore/♻️ chore/")
msg=$(echo "$msg" | sed -e "s/^revert/🗑 revert/")

echo "$msg" > "$1"

pnpm commitlint --edit $1
```

Esse hook troca a palavra inicial da mensagem pelo prefixo com emoji (`feat: ...` vira `✨ feat: ...`) e depois roda o commitlint. Os prefixos são `init`, `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` e `revert`. A mensagem deve estar em inglês, no imperativo e em minúsculas.

### 5. Configurar as regras do editor e do código

Substitua o conteúdo de `.gitignore`, que é bem menor que o gerado:

```text
node_modules
.next
*.tsbuildinfo
next-env.d.ts
```

Crie o arquivo `.editorconfig`:

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

- `root = true`: é o arquivo principal, o EditorConfig não procura outros nas pastas acima.
- `[*]`: vale para todos os arquivos.
- `indent_style` e `indent_size`: indentação com 2 espaços.
- `end_of_line = lf`: final de linha LF, o padrão de Unix e macOS.
- `charset = utf-8`: codificação UTF-8.
- `trim_trailing_whitespace`: remove espaços no final das linhas.
- `insert_final_newline`: garante uma nova linha no final do arquivo.

Instale o [prettier](https://prettier.io/) e a [extensão do VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode):

```bash
pnpm add -D -E prettier
```

Crie o arquivo `.prettierrc`:

```json
{
  "trailingComma": "none",
  "semi": false,
  "singleQuote": true
}
```

Crie o arquivo `.prettierignore`:

```text
pnpm-lock.yaml
```

- `"trailingComma": "none"`: não adiciona vírgulas ao final de listas, objetos e parâmetros.
- `"semi": false`: não adiciona ponto e vírgula.
- `"singleQuote": true`: usa aspas simples.

Remova o script `lint`, gerado pelo `create-next-app`:

```bash
pnpm pkg delete scripts.lint
```

Adicione ao `package.json`:

```json
{
  "scripts": {
    "type-check": "next typegen && tsc --noEmit",
    "eslint:check": "eslint .",
    "eslint:fix": "eslint --fix .",
    "prettier:check": "prettier --check .",
    "prettier:fix": "prettier --write ."
  }
}
```

O `next typegen` gera em `.next/types` tipos globais como o `LayoutProps`. Sem ele, o `type-check` falha em um checkout limpo, como no CI.

### 6. Configurar o ESLint

O linting aplica regras a uma base de código e destaca padrões problemáticos, sem precisar executá-la. O Next.js 16 removeu o `next lint`, então usamos o ESLint direto, com o formato [flat config](https://eslint.org/docs/latest/use/configure/configuration-files).

```bash
pnpm add -D -E @eslint/json @eslint/markdown eslint-config-prettier eslint-plugin-prefer-arrow-functions eslint-plugin-promise eslint-plugin-simple-import-sort eslint-plugin-tailwindcss eslint-plugin-unicorn@74
sed -i -E 's/"\^([0-9])/"\1/' package.json
pnpm install
```

Substitua o conteúdo de `eslint.config.mjs`:

```js
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import pluginPromise from 'eslint-plugin-promise'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss'
import unicorn from 'eslint-plugin-unicorn'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  pluginPromise.configs['flat/recommended'],
  prettier,
  preferArrowFunctions.configs.all,
  {
    extends: [eslintPluginTailwindcss.configs.recommended],
    settings: {
      tailwindcss: {
        cssConfigPath: './src/app/globals.css',
        parseKeyFunctions: ['classnames', 'classNames']
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      unicorn
    },
    extends: ['unicorn/recommended'],
    rules: {
      'unicorn/default-export-style': ['error', { functions: 'separate' }],
      'unicorn/logical-assignment-operators': 'off',
      'unicorn/no-null': 'off',
      'unicorn/name-replacements': [
        'error',
        {
          replacements: {
            props: false,
            utils: false
          }
        }
      ]
    }
  },
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/no-anonymous-default-export': 'off'
    }
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    extends: ['markdown/recommended']
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.claude/**'
  ])
])

export default eslintConfig
```

- `nextVitals` e `nextTs`: as regras do `eslint-config-next` (`core-web-vitals` e TypeScript).
- `eslint-plugin-promise`: boas práticas no uso de Promises.
- `eslint-config-prettier`: desliga as regras que conflitam com o Prettier.
- `eslint-plugin-prefer-arrow-functions`: exige arrow functions.
- `eslint-plugin-tailwindcss`: ordena as classes e acusa conflitos. O `cssConfigPath` aponta para o CSS global, porque o Tailwind v4 não tem mais `tailwind.config.js`.
- `eslint-plugin-unicorn`: um conjunto grande de boas práticas, com quatro ajustes meus. `default-export-style` deixa funções em `export default` separadas, `logical-assignment-operators` e `no-null` ficam desligadas, e o `name-replacements` aceita `props` e `utils`.
- `eslint-plugin-simple-import-sort`: ordena `imports` e `exports` automaticamente.
- `@eslint/json` e `@eslint/markdown`: também validam os arquivos JSON e Markdown.
- `globalIgnores`: o `.claude/**` só passa a existir na Parte 2.

O `eslint-plugin-unicorn@74` declara o peer `eslint >=10.4`, mas o projeto continua no ESLint 9. O peer não é atendido (o `pnpm peers check` mostra, e dependendo da versão o pnpm avisa `Issues with peer dependencies found`), mas o lint roda normalmente. Por isso fixei essa versão, a que validei.

### 7. Configurar o lint-staged e os hooks

Instale o [lint-staged](https://github.com/lint-staged/lint-staged), que executa as ferramentas só nos arquivos do commit:

```bash
pnpm add -D -E lint-staged
```

Crie o arquivo `lint-staged.config.js`:

```js
import path from 'node:path'

const relativeFiles = (filenames) =>
  filenames.map((file) => path.relative(process.cwd(), file)).join(' ')

const prettier = (filenames) =>
  `pnpm exec prettier --write ${relativeFiles(filenames)}`

const eslint = (filenames) =>
  `pnpm exec eslint --fix ${relativeFiles(filenames)}`

export default {
  '*.{js,jsx,ts,tsx,mjs,cjs}': [eslint, prettier],
  '*.{json,md}': [eslint, prettier],
  '*.{yml,yaml}': [prettier]
}
```

Chamamos o `pnpm exec` direto, sem passar pelos scripts do `package.json`, para receber só os arquivos do commit.

Substitua o conteúdo do `.husky/pre-commit`:

```sh
pnpm exec lint-staged
```

Crie o arquivo `.husky/pre-push`:

```sh
pnpm type-check
```

- `pre-commit`: formata e corrige os arquivos do commit.
- `pre-push`: roda o `type-check` antes de enviar o código.

### 8. Configurar o VSCode

Crie o arquivo `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "always" },
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

Crie o arquivo `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "EditorConfig.EditorConfig",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

- `"editor.formatOnSave": true`: formata o arquivo ao salvar.
- `"editor.codeActionsOnSave"`: aplica as correções do ESLint ao salvar.
- `"editor.defaultFormatter"`: define o Prettier como formatador padrão.
- `extensions.json`: o VSCode sugere as extensões para quem abrir o projeto.

### 9. Configurar a Integração Contínua

Crie o arquivo `.github/workflows/ci.yml`:

```yaml
name: ci

on: pull_request

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Commitlint
        run: pnpm exec commitlint --from ${{ github.event.pull_request.head.sha }}~${{ github.event.pull_request.commits }} --to ${{ github.event.pull_request.head.sha }} --verbose

      - name: Type-check
        run: pnpm type-check

      - name: Eslint
        run: pnpm eslint:check

      - name: Prettier
        run: pnpm prettier:check
```

- `on: pull_request`: roda em todo Pull Request.
- `fetch-depth: 0`: baixa o histórico completo, que o commitlint precisa.
- `pnpm/action-setup` sem `version`: lê a versão do campo `packageManager`.
- `node-version-file: .nvmrc`: usa o mesmo Node do projeto.
- `--frozen-lockfile`: instala exatamente o que está no `pnpm-lock.yaml`.
- O commitlint valida todos os commits do PR.

### 10. Ajustar os arquivos gerados e commitar

O `create-next-app` gera `export default function`, e a regra `unicorn/default-export-style` exige declarar a função à parte, como arrow function. O `eslint --fix` não faz essa conversão, então ajuste os dois arquivos.

Substitua o conteúdo de `src/app/layout.tsx`:

```tsx
import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

const RootLayout = ({ children }: LayoutProps<'/'>) => (
  <html
    lang="en"
    className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
  >
    <body className="flex min-h-full flex-col">{children}</body>
  </html>
)

export default RootLayout
```

Substitua o conteúdo de `src/app/page.tsx`. Na Parte 2 ela é reescrita:

```tsx
const Home = () => <h1>Home</h1>

export default Home
```

Substitua o conteúdo de `next.config.ts`, só para tirar o comentário gerado. O `reactCompiler: true` já veio da flag `--react-compiler`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true
}

export default nextConfig
```

O Prettier e o ESLint reformatam o resto dos arquivos gerados (aspas simples, sem ponto e vírgula, ordem das classes do Tailwind):

```bash
pnpm prettier:fix
pnpm eslint:fix
pnpm type-check
git add .
git commit -m "chore: configure code quality tooling and git hooks"
```

O `pre-commit` roda o lint-staged e o `commit-msg` transforma a mensagem em `♻️ chore: configure ...`. Na Parte 2 vamos adicionar o shadcn/ui, a estrutura de pastas, os testes e a configuração para agentes de IA.

## Parte 2 — Tailwind, shadcn/ui, testes e agentes de IA

Continuação da Parte 1, que termina com o projeto, o padrão de código, os Git hooks e o CI configurados. O resultado final está no repositório [next-boilerplate](https://github.com/diasjoaovitor/next-boilerplate).

### 1. Adicionar o shadcn/ui

O Tailwind CSS v4 já veio com o `create-next-app`, com o `@tailwindcss/postcss` e o `postcss.config.mjs`. Falta o [shadcn/ui](https://ui.shadcn.com/), que uso sobre o [Base UI](https://base-ui.com/):

```bash
pnpm dlx shadcn@latest init -d -y
```

O `-d` usa a configuração padrão: template `next`, estilo `base-nova` e cor base `neutral`. O `init` instala `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `shadcn` e `tw-animate-css` com `^`. Fixe as versões:

```bash
sed -i -E 's/"\^([0-9])/"\1/' package.json
pnpm install
```

Adicione ao `package.json`:

```json
{
  "scripts": {
    "shadcn:add": "pnpm dlx shadcn@latest add"
  }
}
```

### 2. Organizar a estrutura de pastas

- `src/app` guarda só o que é exclusivo do frontend.
- As rotas ficam no grupo `src/app/(pages)`, que não afeta a URL.
- Os componentes ficam em `src/app/components` e as funções em `src/app/lib`, cada um exportado por um `index.ts`.
- O que não é do frontend, como `src/tests`, fica em `src`, ao lado de `app`.

```bash
mkdir -p "src/app/(pages)" src/app/styles src/app/lib src/tests/e2e
git mv src/app/layout.tsx src/app/page.tsx "src/app/(pages)"
git mv src/app/globals.css src/app/styles/globals.css
rm -r src/components src/lib
sed -i 's#\./globals\.css#../styles/globals.css#' "src/app/(pages)/layout.tsx"
sed -i 's#\./src/app/globals\.css#./src/app/styles/globals.css#' eslint.config.mjs
```

O `favicon.ico` continua em `src/app`. Os dois últimos comandos corrigem o import do CSS no `layout.tsx` e o `cssConfigPath` do ESLint, que passam a apontar para o novo caminho.

Substitua o conteúdo do `components.json` para apontar os aliases para a nova estrutura:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/app/components",
    "utils": "@/app/lib/utils",
    "ui": "@/app/components/ui/shadcn",
    "lib": "@/app/lib",
    "hooks": "@/app/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

Adicione os componentes `Button` e `Card`. Eles são criados em `src/app/components/ui/shadcn`:

```bash
pnpm shadcn:add button card -y
```

Crie o arquivo `src/app/components/index.ts`:

```ts
export * from './ui/shadcn/button'
export * from './ui/shadcn/card'
```

Crie o arquivo `src/app/lib/index.ts`:

```ts
export * from './utils'
```

Crie o arquivo `src/app/lib/utils.ts`:

```ts
export { cn } from 'cn'
```

Com isso, `import { Button, Card } from '@/app/components'` e `import { cn } from '@/app/lib'` passam a funcionar.

Faça três ajustes em `src/app/styles/globals.css`, gerado pelo `init`:

1. Faça o `dark` seguir o tema do sistema, como no template do Next, em vez da classe `.dark`:

```css
@custom-variant dark (@media (prefers-color-scheme: dark));
```

2. O `init` trocou a fonte por uma referência a si mesma. Restaure:

```css
--font-sans: var(--font-geist-sans);
```

3. Troque o seletor `.dark { ... }`, que fica depois do bloco `:root`, por:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* as mesmas variáveis que estavam dentro de .dark */
  }
}
```

Copie o arquivo `src/app/(pages)/page.tsx` do repositório. É o placeholder do `create-next-app` refeito com `Card` e `buttonVariants`. Um link que precisa parecer um botão deve continuar sendo um `<a>` ou `Link` estilizado com `buttonVariants(...)`, nunca renderizado pelo `Button`. O `Button` do Base UI força `role="button"` e o tratamento de teclado de botão.

Formate e commite:

```bash
pnpm prettier:fix
pnpm eslint:fix
pnpm type-check
git add .
git commit -m "feat: add shadcn/ui components and restructure app folder"
```

### 3. Configurar testes automatizados

Uso o [Vitest](https://vitest.dev/) nos testes unitários e o [Playwright](https://playwright.dev/) nos testes end-to-end:

```bash
pnpm add -D -E vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/dom @playwright/test
pnpm exec playwright install chromium
```

Crie o arquivo `vitest.config.mts`:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}']
  }
})
```

- `resolve.tsconfigPaths`: o Vite resolve os aliases do `tsconfig.json` sem plugin extra.
- `environment: 'jsdom'`: simula o navegador nos testes de componentes.
- `include`: só executa os `*.test.ts` e `*.test.tsx` dentro de `src`, sem tocar nos testes do Playwright.

Crie o arquivo `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: false,
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://localhost:3000'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
```

O `webServer` sobe o `pnpm dev` sozinho, e só reaproveita um servidor que já esteja rodando fora do CI. Agora um teste de cada tipo.

Crie o arquivo `src/app/(pages)/page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import Home from './page'

test('renders a heading', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
})
```

Crie o arquivo `src/tests/e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('renders a heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
```

Adicione ao `package.json`:

```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

Ignore os resultados do Playwright:

```bash
echo "test-results" >> .gitignore
```

### 4. Rodar os testes nos hooks e no CI

Substitua o conteúdo de `lint-staged.config.js`. A novidade é o `vitest related`, que roda só os testes ligados aos arquivos do commit:

```js
import path from 'node:path'

const relativeFiles = (filenames) =>
  filenames.map((file) => path.relative(process.cwd(), file)).join(' ')

const prettier = (filenames) =>
  `pnpm exec prettier --write ${relativeFiles(filenames)}`

const eslint = (filenames) =>
  `pnpm exec eslint --fix ${relativeFiles(filenames)}`

const test = (filenames) =>
  `pnpm exec vitest related --passWithNoTests ${relativeFiles(filenames)}`

export default {
  '*.{js,jsx,ts,tsx,mjs,cjs}': [eslint, prettier, test],
  '*.{json,md}': [eslint, prettier],
  '*.{yml,yaml}': [prettier]
}
```

Adicione o teste e2e ao `pre-push`:

```bash
echo "pnpm test:e2e" >> .husky/pre-push
```

Substitua o conteúdo do `.vscode/extensions.json`, com as extensões do Playwright e do GitHub Actions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "EditorConfig.EditorConfig",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "github.vscode-github-actions"
  ]
}
```

Substitua o conteúdo do `.github/workflows/ci.yml`. Ele ganha os passos dos testes unitários e dos e2e, com a instalação do Chromium:

```yaml
name: ci

on: pull_request

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Commitlint
        run: pnpm exec commitlint --from ${{ github.event.pull_request.head.sha }}~${{ github.event.pull_request.commits }} --to ${{ github.event.pull_request.head.sha }} --verbose

      - name: Type-check
        run: pnpm type-check

      - name: Eslint
        run: pnpm eslint:check

      - name: Prettier
        run: pnpm prettier:check

      - name: Unit tests
        run: pnpm test

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: E2E tests
        run: pnpm test:e2e
```

Formate, rode os testes e commite:

```bash
pnpm prettier:fix
pnpm eslint:fix
pnpm test
pnpm test:e2e
git add .
git commit -m "test: add vitest for unit tests and playwright for e2e tests"
```

### 5. Configurar agentes de IA

O `create-next-app` gerou o `AGENTS.md`, com o bloco de regras do Next.js, e o `CLAUDE.md`, que só contém `@AGENTS.md`.

Copie o `AGENTS.md` do repositório: ele mantém o bloco gerado e acrescenta as convenções do projeto (gerenciador de pacotes, estrutura de pastas, lint, hooks, testes, shadcn/ui e regras de commit). O agente lê essas regras em vez de adivinhar.

Crie o arquivo `.mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "Authorization": "Bearer ${CONTEXT7_API_KEY}"
      }
    },
    "playwright": {
      "type": "stdio",
      "command": "pnpm",
      "args": ["dlx", "@playwright/mcp@latest"],
      "env": {}
    }
  }
}
```

- `context7`: documentação atualizada das bibliotecas. Lê a chave da variável `CONTEXT7_API_KEY`, para que ela nunca entre no repositório.
- `playwright`: deixa o agente controlar um navegador.

Gere uma chave no [Context7](https://context7.com/) e defina a variável no seu shell (no fish, `set -Ux CONTEXT7_API_KEY <chave>`). Se preferir só para este projeto, use o `.claude/settings.local.json`, que fica fora do Git:

```bash
echo ".claude/settings.local.json" >> .gitignore
```

```json
{
  "env": {
    "CONTEXT7_API_KEY": "<sua-chave>"
  }
}
```

Nunca coloque a chave no `.mcp.json` nem no `.claude/settings.json`, porque ambos vão para o repositório.

Copie também do repositório o skill `.claude/skills/new-component/SKILL.md` (como adicionar componentes do shadcn ou componentes compartilhados) e o subagente `.claude/agents/ui-reviewer.md` (revisa semântica e acessibilidade da UI). Depois:

```bash
pnpm prettier:check
pnpm eslint:check
git add .
git commit -m "chore: add assistant skill, subagent and mcp servers"
```

### 6. Executar

Execute `pnpm dev` para iniciar o app, `pnpm test` para os testes unitários e `pnpm test:e2e` para os end-to-end.

### Considerações finais

Este é um `boilerplate` genérico para projetos `Next.js`. Para começar um projeto novo a partir dele:

```sh
pnpm create next-app -e https://github.com/diasjoaovitor/next-boilerplate
```

O repositório está disponível no [meu perfil do GitHub](https://github.com/diasjoaovitor/next-boilerplate) e está aberto a contribuições.
