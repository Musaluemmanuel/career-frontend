# Security Policy

## Supported versions

Security fixes are intended for the current default branch. Older deployments
may not receive fixes; verify the deployed revision with the service
maintainer.

## Reporting a vulnerability

Please do not publish credentials, exploitable details, or personal data in a
public issue. Use a private repository security advisory if that feature is
available. Otherwise, contact a repository maintainer privately and include
the affected page or component, impact, reproduction context, and a safe way
to follow up. Do not include live tokens or user records.

## Frontend security notes

- Treat all browser-delivered code as public; never place provider keys,
  database credentials, or signing secrets in this repository.
- Authentication tokens are stored in tab-scoped browser storage and are
  sensitive while the tab is open.
- Use HTTPS for deployed frontend and API origins.
- Report third-party dependency or CDN concerns with the affected asset and
  version.
- The frontend depends on backend authorization. A frontend check or hidden UI
  control is not a substitute for server-side access control.

See [Authentication Integration](AUTHENTICATION.md) and the backend
[security policy](https://github.com/aicarecommender-alt/career-backend/blob/main/SECURITY.md).
