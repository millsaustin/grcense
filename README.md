# GRCense Monorepo

GRCense is a pnpm-powered mono-repo that bootstraps a modern Governance, Risk, and Compliance (GRC) platform. It includes a Next.js web app, a TypeScript Express API, and shared UI + domain libraries to help teams ship faster with strong conventions.

## Requirements

- Node.js 20+
- pnpm 9+
- SQLite (bundled, no manual install required)

## Getting Started

```bash
# install dependencies
pnpm install

# set up environment
cp .env.example .env

# run web and api apps in parallel
pnpm dev
```

### Workspace Scripts

Common commands are available at the workspace and package levels.

```bash
# web app (Next.js)
pnpm dev:web
pnpm --filter @grcense/web lint

# api service (Express + Prisma)
pnpm dev:api
pnpm --filter @grcense/api prisma:migrate

# shared packages
pnpm --filter @grcense/ui build
pnpm --filter @grcense/lib test
```

## Project Layout

```
apps/
  web/   → Next.js 14 + Tailwind + shadcn/ui
  api/   → Express 4 + Zod + Prisma ORM
packages/
  ui/    → Shared UI primitives (Button, Card, utilities)
  lib/   → Shared schemas, types, and API helpers
```

## Quality Tooling

- **TypeScript** everywhere with strict defaults
- **ESLint** + **Prettier** configured for consistent style
- **Commitlint** + **Husky** enforce Conventional Commits and pre-commit checks

## Prisma

The API service ships with an initial Prisma schema targeting SQLite. Update `DATABASE_URL` in `.env` to target another database engine.

```bash
pnpm --filter @grcense/api prisma:generate
pnpm --filter @grcense/api prisma:migrate
```

## Conventional Commits

Husky hooks are configured automatically via `pnpm install`. Use `pnpm commit` (optional) or commit manually with meaningful messages, e.g. `feat: add risk register module`.

---

Happy shipping! 🎉
