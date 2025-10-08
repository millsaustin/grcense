
# GRCense — Codex-Ready Project Plan (Multi‑Tenant SaaS, Local‑First Dev)

This document is designed so you can **copy/paste prompts into Codex (or a fresh ChatGPT dev chat)** and pick up exactly where you left off. It assumes:

- Deployment Model: **Multi‑tenant SaaS**
- Dev Approach: **Local‑first (Docker Compose)**, with easy promotion to cloud later
- Stack: **Next.js (frontend)**, **Node.js/Express (API)**, **Prisma + PostgreSQL**, **MinIO (S3)**, **HashiCorp Vault (secrets/KMS)**, **pgvector (optional for embeddings)**
- AI Layer: **RAG + Redaction service** with a **privacy toggle** (ephemeral vs persistent embeddings)
- Scope MVP: **SOC 2 first**, with templates, AI‑assisted drafting, evidence guidance + user confirmation, readiness reports

---

## How to Use This Plan

- Each phase has **Steps**. Each step includes **Codex Prompts** you can paste directly into a new session.
- Wherever a step generates or edits files, the prompt is designed to produce **copy‑pastable code**.
- Acceptance Criteria at the end of each phase help you know when you’re done.

At the bottom, you’ll also find a **“New Chat Kickoff Prompt”** that summarizes context to bootstrap any future chat instance fast.

---

## Repo & Folder Structure (target)

```
grcense/
├─ apps/
│  ├─ web/               # Next.js 14 app
│  └─ api/               # Node/Express API
├─ packages/
│  ├─ ui/                # (optional) shared UI components
│  └─ lib/               # shared ts/js libraries
├─ infra/
│  ├─ docker-compose.yml
│  ├─ vault/
│  │  └─ config.hcl
│  └─ minio/
│     └─ server.env
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ compliance/
│  ├─ soc2_controls.json
│  ├─ mappings.json      # control ↔ policy/evidence mapping
│  └─ templates/         # adaptive Markdown templates
├─ src-rag/
│  ├─ server.ts          # RAG service (Express/Fastify)
│  ├─ redact/            # Presidio-like redaction utils
│  └─ retrieval/         # chunking, embedding, search
├─ scripts/
│  ├─ seed.ts
│  └─ audit_log_rotate.sh
├─ docs/
│  ├─ architecture.md
│  ├─ threatmodel.md
│  └─ api.md
├─ .env.example
├─ package.json
└─ README.md
```

---

# Phase 0 — Project Bootstrap & Governance (0.5 day)

**Goal:** Create a clean repository, baseline docs, and project guardrails.

### Step 0.1 — Initialize mono‑repo
**Codex Prompt**:
```
You are my project generator. Create a Node.js pnpm mono‑repo named "grcense" with workspaces:
- apps/web (Next.js 14, TypeScript, Tailwind, shadcn/ui)
- apps/api (Node 20, Express, TypeScript, Zod, Prisma)
- packages/ui (optional), packages/lib (shared types/utils)

Include root package.json with workspaces, pnpm, TS config, eslint, prettier, and commitlint. Add README.md with quickstart.
```

### Step 0.2 — License + Security + Contribution docs
**Codex Prompt**:
```
Add LICENSE (MIT), SECURITY.md (responsible disclosure), and CONTRIBUTING.md (branching, PR, code style). In SECURITY.md, state “No customer data sent to third parties without encryption; AI endpoints configured for zero‑retention by default”.
```

### Step 0.3 — Architecture sketch
**Codex Prompt**:
```
Create docs/architecture.md that diagrams the services: web, api, postgres, minio, vault, rag. Include data‑flow for policy templates, evidence, embeddings. Note per‑tenant encryption via Vault‑managed keys.
```

**Acceptance Criteria (Phase 0):**
- Repo compiles, lint passes
- Docs exist: README, architecture, security, contributing

---

# Phase 1 — Local Infra (Docker Compose) (1–2 days)

**Goal:** One command local stack: Postgres (+pgvector), Vault, MinIO, API, Web, RAG.

### Step 1.1 — Compose stack
**Codex Prompt**:
```
Create infra/docker-compose.yml with services: postgres (15) + pgvector, vault, minio, api, web, rag. Expose:
- Postgres: 5432 (user: grcense, db: grcense)
- Vault: 8200 (dev mode for local only), persisted volume
- MinIO: 9000 (API) + 9001 (console), with root creds from .env
- api: 4000, web: 3000, rag: 4100
Network: internal bridge. Add healthchecks for each.
```

### Step 1.2 — Env wiring
**Codex Prompt**:
```
Create .env.example at repo root with:
DATABASE_URL=postgresql://grcense:grcense@localhost:5432/grcense
VAULT_ADDR=http://localhost:8200
VAULT_TOKEN=dev-root-token
MINIO_ROOT_USER=grcense
MINIO_ROOT_PASSWORD=grcense-secret
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=grcense-tenant
AI_MODE=ephemeral      # or persistent
OPENAI_API_KEY=changeme # placeholder
SESSION_SECRET=changeme
JWT_SECRET=changeme
```

### Step 1.3 — Vault init (local)
**Codex Prompt**:
```
Add infra/vault/config.hcl for dev mode. Add a script scripts/vault-init.sh that creates per‑tenant KV paths: secret/tenants/<tenantId>, and transit keys for envelope encryption (transit/keys/tenant-<id>).
```

**Acceptance Criteria (Phase 1):**
- `docker compose up` brings up all services
- Web, API, RAG reachable; Vault + MinIO UIs accessible

---

# Phase 2 — Database & Prisma Schema (1–2 days)

**Goal:** Multi‑tenant schema with RBAC, policies, controls, evidence, documents, audit logs, and AI prefs.

### Step 2.1 — Prisma schema
**Codex Prompt**:
```
Create prisma/schema.prisma for PostgreSQL with models:
Tenant(id, name, slug, createdAt)
User(id, email, name, tenantId, role: enum(OWNER,ADMIN,EDITOR,VIEWER), authProvider, createdAt)
Control(id, framework: enum(SOC2, FTC, ISO27001, CMMC), code, name, description)
Policy(id, tenantId, title, slug, contentMarkdown, version, framework, controls: m2m Control, updatedBy, updatedAt)
Evidence(id, tenantId, controlId, type: enum(TEXT,FILE,LINK), text, fileKey, createdBy, createdAt, confirmedBy, confirmedAt, status: enum(DRAFT,CONFIRMED,REPLACED))
Document(id, tenantId, name, fileKey, mime, size, uploadedBy, createdAt)
EmbeddingPref(id, tenantId, mode: enum(EPHEMERAL,PERSISTENT), createdAt)
AuditLog(id, tenantId, actorId, action, entityType, entityId, data JSONB, createdAt)

Add join tables as needed and a unique index on (tenantId, slug) for Policy.
```

### Step 2.2 — Migrations + seed
**Codex Prompt**:
```
Add prisma migration and scripts/seed.ts to create:
- One test tenant, an OWNER user
- SOC 2 controls CC1–CC9 basic entries
- Default EmbeddingPref = EPHEMERAL
```

**Acceptance Criteria (Phase 2):**
- `pnpm prisma migrate dev` works
- Seed creates tenant, user, controls

---

# Phase 3 — API Skeleton (Auth, RBAC, CRUD) (3–4 days)

**Goal:** Secure API with tenant isolation, RBAC, CRUD for Policies, Evidence, Documents, Controls, and Audit logs.

### Step 3.1 — API project setup
**Codex Prompt**:
```
In apps/api, bootstrap Express (TS) with zod validation, helmet, morgan, and JWT session cookies. Implement middleware for tenant scoping and RBAC (OWNER/ADMIN/EDITOR/VIEWER). Add error handler with request IDs.
```

### Step 3.2 — Auth endpoints
**Codex Prompt**:
```
Add auth endpoints: POST /auth/login (email+magic link or password for dev), POST /auth/logout, GET /auth/me. For now, implement a dev login that accepts email and tenant slug and issues a signed JWT with role from DB.
```

### Step 3.3 — Core CRUD
**Codex Prompt**:
```
Add endpoints:
- /policies [GET/POST], /policies/:id [GET/PUT], /policies/:id/controls [PUT]
- /evidence [GET/POST], /evidence/:id [GET/PUT], and /evidence/:id/confirm [POST] (sets status=CONFIRMED, confirmedBy/At)
- /documents [GET/POST]
- /controls [GET]
All endpoints enforce tenantId from JWT and log to AuditLog.
```

### Step 3.4 — Files & MinIO
**Codex Prompt**:
```
Implement S3 client for MinIO with bucket from env. Add signed URL upload/download for /documents and file‑type Evidence. Store file metadata in DB.
```

### Step 3.5 — Readiness scoring
**Codex Prompt**:
```
Implement GET /readiness/soc2 that calculates coverage:
- % of SOC2 controls that have at least 1 CONFIRMED evidence or mapped policy
- return per‑control status and overall score
```

**Acceptance Criteria (Phase 3):**
- All endpoints functional with tenant isolation
- AuditLog written on create/update/confirm
- Readiness endpoint returns sensible results

---

# Phase 4 — Frontend App (Next.js) (3–5 days)

**Goal:** Usable portal with frameworks dashboard, policy editor, evidence workflow (with confirmation), readiness report.

### Step 4.1 — App shell + auth
**Codex Prompt**:
```
In apps/web, create Next.js 14 app with:
- Auth pages (dev login via email+tenant slug)
- App layout: sidebar (Frameworks, Policies, Evidence, Readiness, Settings)
- Dark/light theme, shadcn/ui components
```

### Step 4.2 — Policies module
**Codex Prompt**:
```
Implement Policies list + detail editor (Markdown + rich text toggle). Show control mappings. Add version bump on save. Show diff viewer between versions.
```

### Step 4.3 — Evidence module (hybrid B + C)
**Codex Prompt**:
```
Implement Evidence page:
- Add evidence: TEXT (guided Q&A), FILE upload, or LINK
- For TEXT: show a prompt wizard with questions per control; render AI‑normalized text; require user "Confirm" to lock it (status=CONFIRMED) and write audit log.
```

### Step 4.4 — Readiness reports
**Codex Prompt**:
```
Implement Readiness dashboard for SOC 2:
- Overall score, per‑control chips (OK / Needs Evidence / No Policy)
- Export PDF report with score + narrative summary
```

### Step 4.5 — Settings
**Codex Prompt**:
```
Implement tenant Settings → Privacy toggle for embeddings (EPHEMERAL vs PERSISTENT). Display plain English explanation and show AuditLog entries when changed.
```

**Acceptance Criteria (Phase 4):**
- End‑to‑end: create/edit/confirm evidence and see readiness move
- Policy editor with version history works
- PDF export produces a readable report

---

# Phase 5 — AI Layer (RAG + Redaction + Templates) (4–6 days)

**Goal:** A safe AI layer that can: (1) adapt templates to environment inputs, (2) normalize evidence narratives, (3) answer questions with citations, and (4) respect privacy toggle.

### Step 5.1 — RAG service skeleton
**Codex Prompt**:
```
In src-rag/server.ts, create a Fastify or Express service exposing:
POST /rag/answer { tenantId, query } → { answer, citations[] }
POST /rag/normalize-evidence { tenantId, controlId, rawText } → { normalizedText }
POST /rag/adapt-template { tenantId, templateKey, inputs{} } → { markdown }
Honor env AI_MODE (EPHEMERAL vs PERSISTENT). For persistent, store embeddings per tenant; for ephemeral, do not persist vector data.
```

### Step 5.2 — Redaction utilities
**Codex Prompt**:
```
Add src-rag/redact with redactors for PII (SSN, EIN, phone, email). Provide a function redact(text, mode) that masks tokens before embedding/inference. Ensure policy templates are processed with redaction in EPHEMERAL mode.
```

### Step 5.3 — Embeddings + retrieval
**Codex Prompt**:
```
Implement retrieval pipeline:
- Chunk Markdown/PDFs
- Compute embeddings (OpenAI text-embedding-3-large or local alt)
- Store and search: pgvector or simple JSON index per tenant (for local dev)
Return passages as citations with file and location metadata.
```

### Step 5.4 — Adaptive templates
**Codex Prompt**:
```
Create compliance/templates/ for SOC 2 policies. Implement a small DSL in YAML frontmatter for variables (e.g., idp=GoogleWorkspace, mfa=true). The /rag/adapt-template endpoint merges inputs and rewrites sections accordingly.
```

### Step 5.5 — Web ↔ RAG integration
**Codex Prompt**:
```
Wire the web app:
- In Policies editor, “Generate from Template” → calls /rag/adapt-template
- In Evidence wizard, “Normalize” → calls /rag/normalize-evidence
- In Frameworks or a Chat panel, user asks questions → /rag/answer with citations rendered
```

**Acceptance Criteria (Phase 5):**
- AI normalization yields clean, concise evidence text
- Templates adapt based on inputs (e.g., IDP choice changes language)
- Privacy toggle demonstrably affects persistence of embeddings

---

# Phase 6 — SOC 2 Library & Mapping (2–3 days)

**Goal:** Usable SOC 2 baseline to drive readiness scoring and templates.

### Step 6.1 — Control library
**Codex Prompt**:
```
Populate compliance/soc2_controls.json with CC1.1–CC9.x entries (code, title, description). Minimal but accurate text.
```

### Step 6.2 — Mappings
**Codex Prompt**:
```
Create compliance/mappings.json mapping SOC 2 controls to recommended policies and evidence types. Example: CC6.6 → Access Control Policy, MFA policy, quarterly access review evidence.
```

**Acceptance Criteria (Phase 6):**
- Readiness reflects mappings
- Evidence wizard questions vary by control

---

# Phase 7 — Hardening, Audit, and Ops (2–3 days)

**Goal:** Production‑minded posture for a small beta.

### Step 7.1 — Audit + log rotation
**Codex Prompt**:
```
Add scripts/audit_log_rotate.sh and document immutable log strategy in docs/architecture.md. Ensure API writes requestId and actor to AuditLog entries.
```

### Step 7.2 — Backups
**Codex Prompt**:
```
Document backup/restore for Postgres and MinIO. Create scripts to dump/restore. Add a README section “Disaster Recovery (Local Dev)”.
```

### Step 7.3 — Security headers + TLS
**Codex Prompt**:
```
Enable strict security headers in web+api, document TLS termination plan (Caddy/Traefik) for production. Add content-security-policy with safe defaults.
```

**Acceptance Criteria (Phase 7):**
- Logs are comprehensive and rotated
- Backup/restore guide tested locally
- Security headers verified

---

# Phase 8 — Beta Package & Onboarding (1–2 days)

**Goal:** Buttoned‑up demo with onboarding flow.

### Step 8.1 — Onboarding wizard
**Codex Prompt**:
```
Add a 5‑minute onboarding wizard that asks environment questions (IDP, MFA, OS, backup approach) and pre‑fills template variables. At the end, generate initial policies and show readiness baseline.
```

### Step 8.2 — Demo data & script
**Codex Prompt**:
```
Add scripts/seed_demo.ts to populate a demo tenant with sample policies, a couple of evidence entries, and a 60–70% readiness state.
```

**Acceptance Criteria (Phase 8):**
- New tenant can reach 60–70% readiness in ~30 minutes
- Onboarding creates visible momentum (policies + gaps)

---

## New Chat Kickoff Prompt (Paste This to Resume Anywhere)

```
You are continuing the GRCense project (multi‑tenant SaaS, local‑first). Our stack is Next.js (web), Node/Express (api), Prisma/Postgres, MinIO, Vault, pgvector, and an AI RAG service with a privacy toggle (ephemeral vs persistent).

Goal: SOC 2 MVP where users can adapt policy templates, add/confirm evidence via guided AI normalization, and see a readiness report.

Start at Phase <X>, Step <Y> from the plan in GRCense_ProjectPlan.md. Generate the files and code for that step, preserving the repo structure. Use TypeScript. Include any seed/migration changes required. Be explicit about commands to run and env variables to set.
```

---

## Notes on Pricing (to decide later)
- Keep a la carte modules (SOC 2 first) with an **Enterprise** bundle.
- White‑label channel later (branding + rev share or per‑client fee).

## What “Done” Looks Like for MVP
- A small firm can sign in, run onboarding, generate adapted SOC 2 policies, add/confirm evidence with AI help, and export a readiness report — all without outside consultants.
