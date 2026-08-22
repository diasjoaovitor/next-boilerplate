<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Conventions

### Package manager

- Use **pnpm** only (not npm/yarn).
- All dependency versions are pinned exact (no `^`/`~`) in `package.json`. Install new deps with `pnpm add -E <pkg>` (or `pnpm add -D -E <pkg>` for dev deps) — never hand-edit version strings.
- Node version is pinned in `.nvmrc` (`lts/krypton`).

### Linting & formatting

- ESLint uses native flat config (`eslint.config.mjs`), extending `eslint-config-next`'s `core-web-vitals`/`typescript` configs, plus `eslint-plugin-unicorn`, `eslint-plugin-simple-import-sort`, `eslint-plugin-tailwindcss`, and `@eslint/json`/`@eslint/markdown` for JSON/Markdown files.
- `eslint-plugin-unicorn` is pinned to `65.0.1` — versions ≥66 require ESLint ≥10, but this project stays on ESLint 9. Don't bump one without the other.
- `next lint` no longer exists (removed in Next.js 16). Use `pnpm eslint:check` / `pnpm eslint:fix` and `pnpm prettier:check` / `pnpm prettier:fix`.
- Prettier style: single quotes, no semicolons, no trailing commas (`.prettierrc`).

### Git hooks (husky)

- `pre-commit`: runs `lint-staged` (`lint-staged.config.js`) — prettier + eslint (+ `vitest related --run` for `.js/.jsx/.ts/.tsx/.mjs/.cjs`) scoped per staged file type, invoked directly via `pnpm exec` rather than through `package.json` scripts.
- `commit-msg`: auto-prepends the emoji prefix from the Commit Rules below based on the leading word (e.g. `feat: ...` → `✨ feat: ...`), then runs `commitlint` (`commitlint-config-emoji-convention`). You can type the plain word and let the hook add the emoji.
- `pre-push`: runs `pnpm type-check` (`tsc --noEmit`).

### Testing

- Vitest, not Jest (config in `vitest.config.ts`, jsdom environment, setup file `vitest.setup.ts`). Test files use `*.test.tsx`/`*.test.ts`.
- `@/*` resolves to `src/*`.
- Run `pnpm test` (single run) or `pnpm test:watch`.

### Styling & UI

- Tailwind CSS v4 (`@tailwindcss/postcss` only — no `autoprefixer`/`postcss`, v4 uses Lightning CSS internally). Global styles live in `src/app/styles/globals.css`.
- shadcn/ui: add components with `pnpm shadcn:add <component>` (wraps `shadcn@latest add`). Per the custom alias in `components.json`, components land in `src/app/components/ui/shadcn` — **not** the CLI default `src/components/ui`.
- Other `components.json` aliases: `components` → `@/app/components`, `lib` → `@/lib`, `utils` → `@/lib/utils` (the `cn` helper), `hooks` → `@/hooks`.
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler` devDependency).

### Scaffolding

- `pnpm generate` runs the Plop generator (`generators/plopfile.js`) to scaffold a component: creates `src/app/components/<kebab-name>/index.tsx` + `<kebab-name>.test.tsx`, and appends/re-sorts the barrel export in `src/app/components/index.ts`.

## Commit Rules

Commit messages must be in English and follow this format:

- Use the following semantic prefixes: `🎉 init, ✨ feat, 🐛 fix, 📚 docs, 💎 style, 📦 refator, 🚀 perf, 🚨 test, 🛠 build, ⚙️ ci, ♻️ chore, 🗑 revert`
- The message must be in the imperative mood and in lowercase.
- Write the commit body as a list.
- Reference an associated issue by number, if it exists, using the format `Issue: #<number>`.

Example:

```text
✨ feat: add product page

- Create product page
- Add product table
- Add product form

Issue: #1
```
