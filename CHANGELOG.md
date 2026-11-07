# Changelog

Notable user-facing changes are recorded here. Entries are grouped by release;
the repository does not currently use formal version tags.

## Unreleased

- Use the official CareerPath AI image asset consistently for login, dashboard,
  chat-avatar, favicon, Apple touch-icon, reports, and PWA branding.
- Add service-worker cache `career-v15-exact-logo-all` to invalidate old logo
  assets and replace the displayed image for existing installations.
- Maintain the navy/blue chat experience with blue-green application accents.
- Keep responsive navigation and the service-worker authentication bridge.
- Document local setup, student usage, authentication, support, and contribution
  guidance.

## Validation — 2026-11-07

- Verified the exact attachment SHA-256 hash is identical to
  `icons/careerpath-logo.png` in the alternate frontend repository.
- Verified Vercel serves the login and dashboard references as
  `icons/careerpath-logo.png?v=20261107-7`.
- Verified the live dashboard chat avatar also uses the same image asset.
- JavaScript and working-tree whitespace checks passed.
