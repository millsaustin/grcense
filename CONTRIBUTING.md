# Contributing to GRCense

## Branching

Prefix branches with feat/, fix/, or chore/.  
`main` is protected.

## Commit Messages

Use Conventional Commits (checked by commitlint).

## Secure Coding Checklist

- [ ] No secrets or tokens in commits
- [ ] All input validated with Zod
- [ ] Role & tenant verified on every API call
- [ ] Run `pnpm audit` fix Criticals before PR
- [ ] Update `/docs/security.md` if new secrets introduced
- [ ] Add or update tests for any security-sensitive change

## Pull-Request Template

### Summary

### Testing Performed

### Security Considerations

- Threats introduced / mitigations
- Dependencies added

### Checklist

- [ ] Lint passes
- [ ] Threat model updated (if relevant)
