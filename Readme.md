# Next Boilerplate

Baseado no [boilerplate-apps-router](https://github.com/React-Avancado/boilerplate-apps-router) do curso [React Avançado](https://reactavancado.com.br/)

## Tecnologias

### Core Framework

- **[Next.js](https://nextjs.org/)** - Framework React para produção com renderização híbrida (SSR/SSG), roteamento automático, otimizações de performance e suporte completo ao TypeScript.

### Gerenciador de Pacotes

- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes rápido, eficiente e que economiza espaço em disco através de links simbólicos, garantindo instalações mais rápidas e consistência nas dependências.

### Linguagem e Tipagem

- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript que adiciona tipagem estática, melhorando a experiência de desenvolvimento, detectando erros em tempo de compilação e facilitando a manutenção do código.

### Testes

- **[Jest](https://jestjs.io/pt-BR/)** - Framework de testes JavaScript com suporte a cobertura de código, mocks, snapshots e execução em paralelo, configurado com ambiente jsdom para testes de componentes React.
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Biblioteca de utilitários para testar componentes React de forma simples e focada no comportamento do usuário, seguindo as melhores práticas de acessibilidade.

### Qualidade de Código

- **[ESLint](https://eslint.org/)** - Linter configurado com regras para Next.js, TypeScript, Jest e Prettier, incluindo plugin para ordenação automática de imports.
- **[Prettier](https://prettier.io/)** - Formatador de código que garante consistência visual no estilo de código, integrado com ESLint e configurado para executar automaticamente.

### Git Hooks e Workflow

- **[Husky](https://typicode.github.io/husky/)** - Gerencia Git hooks para automatizar tarefas como linting e validação de commits antes do push.
- **[Commitlint](https://commitlint.js.org/)** - Valida mensagens de commit seguindo convenções semânticas com emojis, garantindo padronização e clareza no histórico do projeto.
- **[lint-staged](https://www.npmjs.com/package/lint-staged)** - Executa linters apenas nos arquivos modificados durante o commit, otimizando performance e garantindo qualidade.

### Geração de Código

- **[Plop](https://plopjs.com/documentation/)** - Gerador de código para criar componentes React automaticamente com templates personalizados, incluindo arquivos de teste e exportação automática.

## Scripts

### Desenvolvimento

- **`dev`** - Inicia o servidor de desenvolvimento Next.js com hot reload e otimizações para desenvolvimento.
- **`build`** - Gera a versão de produção otimizada do projeto com todas as otimizações do Next.js.
- **`start`** - Inicia o servidor de produção após o build, ideal para deploy em produção.

### Testes

- **`test`** - Executa todos os testes uma única vez usando Jest.
- **`test:watch`** - Executa os testes em modo watch, reexecutando automaticamente quando arquivos são modificados.
- **`test:ci`** - Executa testes em modo CI (Continuous Integration) com execução sequencial e configurações otimizadas para ambientes automatizados.

### Qualidade de Código

- **`lint:check`** - Verifica problemas de linting no código sem fazer correções automáticas.
- **`lint:fix`** - Executa o ESLint e corrige automaticamente os problemas que podem ser resolvidos.
- **`prettier:check`** - Verifica se o código está formatado corretamente segundo as regras do Prettier.
- **`prettier:fix`** - Formata automaticamente todo o código usando Prettier.

### Configuração

- **`prepare`** - Script executado automaticamente após `npm install`, configura o Husky para os Git hooks.

### Geração de Código

- **`generate`** - Inicia o gerador de componentes Plop para criar novos componentes com templates padronizados.

## CI/CD (Continuous Integration/Continuous Deployment)

O projeto está configurado com um pipeline de CI/CD usando **GitHub Actions** que garante a qualidade e consistência do código antes de qualquer merge.

### Fluxo de Integração Contínua

O pipeline é executado automaticamente em **todos os Pull Requests** e inclui as seguintes etapas:

#### 🔄 **Configuração do Ambiente**

- **Sistema**: Ubuntu Latest
- **Node.js**: Versão LTS Iron (definida em `.nvmrc`)
- **Gerenciador de Pacotes**: pnpm
- **Cache**: Dependências pnpm são cacheadas para otimizar performance

#### 📦 **Instalação de Dependências**

```yaml
pnpm install --frozen-lockfile
```

- Instala dependências de forma limpa e determinística usando pnpm
- Usa cache para acelerar o processo
- `--frozen-lockfile` garante instalação exata conforme especificado no `pnpm-lock.yaml`

#### ✅ **Validações de Qualidade**

1. **Commitlint** - Valida mensagens de commit
   - Verifica se seguem o padrão semântico com emojis
   - Analisa todos os commits do PR

2. **Prettier** - Verificação de formatação

   ```bash
   pnpm run prettier:check
   ```

   - Garante consistência no estilo do código

3. **ESLint** - Análise de código

   ```bash
   pnpm run lint:check
   ```

   - Verifica problemas de linting
   - Aplica regras do Next.js, TypeScript e Jest

4. **Testes** - Execução automatizada

   ```bash
   pnpm run test:ci
   ```

   - Executa todos os testes em modo CI
   - Configurado para ambiente de integração contínua

### 🚦 **Critérios de Aprovação**

Para que um Pull Request seja aprovado, **todas** as validações devem passar:

- ✅ Mensagens de commit seguem o padrão
- ✅ Código está formatado corretamente
- ✅ Não há problemas de linting
- ✅ Todos os testes passam

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

# Instalar dependência de produção
pnpm add <package>

# Instalar dependência de desenvolvimento
pnpm add -D <package>

# Executar scripts
pnpm run <script>

# Executar comandos
pnpm exec <command>
```

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

Escrevi [esse tutorial](https://www.tabnews.com.br/diasjoaovitor/tutorial-como-criar-um-boilerplate-para-projetos-com-next-js) incluindo todos os passos para a criação do boilerplate

Caso queira utilizar esse boilerplate:

```
npx create-next-app -e https://github.com/diasjoaovitor/next-boilerplate
```
