# Security Policy

## Reporting Vulnerabilities

Email security@grcense.io with a clear description and reproduction steps.
Never post sensitive findings publicly until a fix is released.

## Data Handling

- No customer data leaves the tenant boundary unencrypted.
- AI endpoints are configured for zero-retention by default.
- Per-tenant encryption keys are managed by Vault.
- Secrets live only in environment variables or Vault KV.

## Developer Security Requirements

- Run `pnpm audit` and `npm outdated` before merges.
- No credentials or API keys in source.
- Enable ESLint security rules; fix all warnings.
- Use parameterized queries (Prisma handles this by default).
- Verify `helmet` middleware and TLS termination in API and web.
