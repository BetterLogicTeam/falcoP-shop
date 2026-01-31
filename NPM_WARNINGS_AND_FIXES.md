# npm Warnings & Vulnerabilities

## What you saw

After `npm install` you may see:

1. **Deprecation warnings** (inflight, @humanwhocodes/*, glob@7, eslint@8)
2. **11 vulnerabilities** (1 low, 4 moderate, 6 high)

## Fix vulnerabilities (run locally)

```bash
# Safe fixes only (no breaking changes)
npm audit fix

# If issues remain and you accept possible breaking changes
npm audit fix --force
```

Run `npm audit` again to see what’s left. `npm audit fix --force` can change dependency versions; test the app after.

## Deprecation warnings (why they appear)

| Warning | Cause | What to do |
|--------|--------|------------|
| **inflight** | Old transitive dependency (e.g. from glob/fs). | Ignore for now; will disappear when upstream deps update. |
| **@humanwhocodes/object-schema, config-array** | Brought in by **ESLint 8**. | Will go away when you move to ESLint 9 (e.g. with Next 15). |
| **glob@7.2.3** | Transitive (e.g. from ESLint/tooling). | Same as above; tooling will move to glob 9+ over time. |
| **eslint@8.57.1** | ESLint 8 is end-of-life. | With **Next.js 14**, `eslint-config-next` expects ESLint 8. Stay on ESLint 8 until you upgrade to Next 15, then you can use ESLint 9. |

So: the deprecations are mostly from **ESLint 8** and its dependencies. They are safe to ignore until you upgrade to Next 15 and ESLint 9.

## Summary

- Run **`npm audit fix`** (and optionally **`npm audit fix --force`** after testing) to address vulnerabilities.
- Treat the **deprecation** messages as informational; no code changes required for Next 14. Plan an upgrade to Next 15 + ESLint 9 when you’re ready to clear them.
