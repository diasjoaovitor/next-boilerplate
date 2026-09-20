# Next Boilerplate

Baseado no [boilerplate-apps-router](https://github.com/React-Avancado/boilerplate-apps-router) do curso [React Avançado](https://reactavancado.com.br/)

## Tecnologias

### Core Framework

- **[Next.js](https://nextjs.org/)** - Framework React para produção com App Router, renderização híbrida (SSR/SSG), otimizações de performance e suporte completo ao TypeScript. O **[React Compiler](https://react.dev/learn/react-compiler)** está habilitado.

### Gerenciador de Pacotes

- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes rápido e eficiente. A versão usada é fixada no campo `packageManager` do `package.json` e as dependências são fixadas em versões exatas.

### Linguagem e Tipagem

- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript que adiciona tipagem estática, detecta erros em tempo de compilação e facilita a manutenção do código.

### Estilização e UI

- **[Tailwind CSS](https://tailwindcss.com/)** v4 - Framework CSS utilitário, configurado pelo `@tailwindcss/postcss`. Os estilos globais ficam em `src/app/styles/globals.css`.
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes (`base-nova`, cor base `neutral`) construídos sobre o **[Base UI](https://base-ui.com/)**, com `class-variance-authority`, `cn` e ícones do `lucide-react`. Os componentes ficam em `src/app/components/ui/shadcn`.

### Testes

- **[Vitest](https://vitest.dev/)** - Framework de testes unitários com ambiente `jsdom`, que só executa os arquivos `src/**/*.test.{ts,tsx}`.
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Utilitários para testar componentes React com foco no comportamento do usuário.
- **[Playwright](https://playwright.dev/)** - Testes end-to-end no Chromium, em `src/tests/e2e`. O servidor de desenvolvimento sobe automaticamente.

### Qualidade de Código

- **[ESLint](https://eslint.org/)** - Linter com flat config, estendendo as regras do `eslint-config-next` e os plugins `unicorn`, `simple-import-sort`, `tailwindcss`, `promise` e `prefer-arrow-functions`, além de `@eslint/json` e `@eslint/markdown` para arquivos JSON e Markdown.
- **[Prettier](https://prettier.io/)** - Formatador de código com aspas simples, sem ponto e vírgula e sem vírgulas finais.
- **[EditorConfig](https://editorconfig.org/)** - Indentação de 2 espaços, final de linha LF, UTF-8 e nova linha ao final do arquivo.

### Git Hooks e Workflow

- **[Husky](https://typicode.github.io/husky/)** - Gerencia os Git hooks do projeto.
- **[Commitlint](https://commitlint.js.org/)** - Valida mensagens de commit seguindo convenções semânticas com emojis (`commitlint-config-emoji-convention`).
- **[lint-staged](https://www.npmjs.com/package/lint-staged)** - Executa Prettier, ESLint e os testes relacionados apenas nos arquivos do commit.

### Assistentes de IA

- **`AGENTS.md`** (importado pelo `CLAUDE.md`) - Convenções do projeto para agentes de código.
- **`.mcp.json`** - Servidores MCP `context7` (documentação de bibliotecas) e `playwright`.
- **`.claude/`** - Skill `new-component`, para adicionar componentes, e subagente `ui-reviewer`, que revisa a semântica e a acessibilidade da UI.

## Estrutura de pastas

```text
src
├── app                 # exclusivo do frontend
│   ├── (pages)         # rotas (o grupo não afeta a URL)
│   ├── components      # componentes compartilhados (index.ts é o barrel)
│   │   └── ui/shadcn   # componentes do shadcn/ui
│   ├── lib             # funções compartilhadas (index.ts é o barrel)
│   ├── styles          # globals.css
│   └── favicon.ico
└── tests
    └── e2e             # testes do Playwright
```

O que não é exclusivo do frontend, como `src/tests`, fica direto em `src`, ao lado de `app`. O alias `@/*` aponta para `src/*`.

## Scripts

### Desenvolvimento

- **`dev`** - Inicia o servidor de desenvolvimento do Next.js.
- **`build`** - Gera a versão de produção otimizada do projeto.
- **`start`** - Inicia o servidor de produção após o build.

### Testes

- **`test`** - Executa os testes unitários uma única vez com o Vitest.
- **`test:watch`** - Executa os testes unitários em modo watch.
- **`test:e2e`** - Executa os testes end-to-end com o Playwright.
- **`test:e2e:ui`** - Executa os testes end-to-end no modo UI do Playwright.

### Qualidade de Código

- **`type-check`** - Gera os tipos das rotas (`next typegen`) e verifica os tipos com `tsc --noEmit`. Os tipos gerados, como o `LayoutProps`, não existem em um checkout limpo.
- **`eslint:check`** - Verifica problemas de linting sem corrigir nada.
- **`eslint:fix`** - Executa o ESLint e corrige o que for possível.
- **`prettier:check`** - Verifica se o código está formatado segundo as regras do Prettier.
- **`prettier:fix`** - Formata todo o código com o Prettier.

### Componentes

- **`shadcn:add`** - Adiciona componentes do shadcn/ui, por exemplo `pnpm shadcn:add dialog`.

### Configuração

- **`prepare`** - Executado automaticamente após o `pnpm install`, configura o Husky.

## Git Hooks

- **`pre-commit`** - Executa o `lint-staged`: Prettier, ESLint e `vitest related` nos arquivos do commit.
- **`commit-msg`** - Adiciona o emoji ao prefixo da mensagem e valida com o Commitlint. Basta escrever `feat: add product page` que o hook transforma em `✨ feat: add product page`.
- **`pre-push`** - Executa `pnpm type-check` e `pnpm test:e2e`.

As mensagens de commit são em inglês, no imperativo e em minúsculas, com um dos prefixos `init`, `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` e `revert`.

## CI/CD (Continuous Integration/Continuous Deployment)

O projeto está configurado com um pipeline usando **GitHub Actions** (`.github/workflows/ci.yml`) que garante a qualidade e a consistência do código antes de qualquer merge.

### Fluxo de Integração Contínua

O pipeline é executado automaticamente em **todos os Pull Requests** e inclui as seguintes etapas:

#### 🔄 **Configuração do Ambiente**

- **Sistema**: Ubuntu Latest
- **Node.js**: Versão LTS Krypton (definida em `.nvmrc`)
- **Gerenciador de Pacotes**: pnpm, na versão do campo `packageManager` do `package.json`
- **Cache**: As dependências do pnpm são cacheadas para otimizar a performance

#### 📦 **Instalação de Dependências**

```yaml
pnpm install --frozen-lockfile
```

- Instala as dependências de forma limpa e determinística
- `--frozen-lockfile` garante a instalação exata do que está no `pnpm-lock.yaml`

#### ✅ **Validações de Qualidade**

1. **Commitlint** - Valida as mensagens de commit
   - Verifica se seguem o padrão semântico com emojis
   - Analisa todos os commits do PR

2. **Type-check** - Verificação de tipos

   ```bash
   pnpm type-check
   ```

3. **ESLint** - Análise de código

   ```bash
   pnpm eslint:check
   ```

4. **Prettier** - Verificação de formatação

   ```bash
   pnpm prettier:check
   ```

5. **Testes unitários**

   ```bash
   pnpm test
   ```

6. **Testes end-to-end** - Instala o Chromium e executa o Playwright

   ```bash
   pnpm exec playwright install --with-deps chromium
   pnpm test:e2e
   ```

### 🚦 **Critérios de Aprovação**

Para que um Pull Request seja aprovado, **todas** as validações devem passar:

- ✅ Mensagens de commit seguem o padrão
- ✅ Os tipos estão corretos
- ✅ Não há problemas de linting
- ✅ O código está formatado corretamente
- ✅ Todos os testes passam

## Assistentes de IA

O `.mcp.json` lê a chave do Context7 da variável de ambiente `CONTEXT7_API_KEY`, para que ela nunca vá para o repositório:

1. Gere uma chave no painel do [Context7](https://context7.com).
2. Defina a variável:
   - **Todos os projetos:** exporte no seu shell. No fish, `set -Ux CONTEXT7_API_KEY <sua-chave>`. No bash ou zsh, adicione `export CONTEXT7_API_KEY=<sua-chave>` ao `~/.bashrc` ou `~/.zshrc`.
   - **Só este projeto:** adicione ao `.claude/settings.local.json`, que está no `.gitignore`:

     ```json
     {
       "env": {
         "CONTEXT7_API_KEY": "<sua-chave>"
       }
     }
     ```

3. Reinicie o Claude Code e rode `/mcp` para conferir se o `context7` está conectado.

Nunca coloque a chave no `.mcp.json` nem no `.claude/settings.json`, porque ambos vão para o repositório.

## Uso do pnpm

Este projeto utiliza o **pnpm** como gerenciador de pacotes. O pnpm oferece várias vantagens:

- **Performance**: Instalações mais rápidas através de links simbólicos
- **Eficiência**: Economiza espaço em disco reutilizando dependências
- **Segurança**: Estrutura de node_modules mais segura
- **Compatibilidade**: Totalmente compatível com npm e yarn

### Comandos Principais

```bash
# Instalar dependências
pnpm install

# Instalar dependência de produção (versão exata)
pnpm add -E <package>

# Instalar dependência de desenvolvimento (versão exata)
pnpm add -D -E <package>

# Executar scripts
pnpm run <script>

# Executar comandos
pnpm exec <command>
```

As versões de `dependencies` e `devDependencies` são sempre exatas (sem `^` ou `~`). O `-E` só tem efeito quando a versão não é informada: com `pnpm add -E <package>@<version>` o pnpm grava `^` mesmo assim, então remova o `^` em seguida (`sed -i -E 's/"\^([0-9])/"\1/' package.json`) e rode `pnpm install`.

### Migração do npm/yarn

Se você está acostumado com npm ou yarn, aqui estão os comandos equivalentes:

| npm/yarn         | pnpm                             |
| ---------------- | -------------------------------- |
| `npm install`    | `pnpm install`                   |
| `npm ci`         | `pnpm install --frozen-lockfile` |
| `npm run script` | `pnpm run script`                |
| `npx command`    | `pnpm exec command`              |
| `yarn add`       | `pnpm add`                       |
| `yarn add -D`    | `pnpm add -D`                    |

## Passo a passo

Escrevi [esse tutorial](https://www.tabnews.com.br/diasjoaovitor/tutorial-como-criar-um-boilerplate-para-projetos-com-next-js) incluindo todos os passos para a criação do boilerplate.

A versão atualizada, que segue o estado atual do projeto, está em [`docs/tutorial.md`](./docs/tutorial.md), dividida em duas partes.

Caso queira utilizar esse boilerplate:

```sh
pnpm create next-app -e https://github.com/diasjoaovitor/next-boilerplate
```
