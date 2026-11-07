# CareerPath AI Frontend

CareerPath AI is a student-focused career and education guidance application.
This repository contains the static browser frontend; the independently
maintained Django API is in
[aicareerrecommender-alt/career-backend](https://github.com/aicareerrecommender-alt/career-backend).

## Features

- Account registration, email verification, password sign-in, and Google sign-in.
- Career exploration chat and personalized course recommendations.
- Optional PDF, image, and video chat attachments.
- Browser-saved previous chats and generated reports.
- Responsive layout with a blue-green theme.

See the [User Guide](USER_GUIDE.md) for student instructions and
[Authentication](AUTHENTICATION.md) for frontend/backend token integration.

## Run locally

This is a static site; it does not require a frontend package installation or
build step. With Python installed, run a local static server from this
directory:

```powershell
python -m http.server 8765
```

Open <http://127.0.0.1:8765/>. A local web server is required for the service
worker; opening `index.html` directly as a `file://` URL will not exercise all
app features.

The pages currently use the configured hosted API. To develop against a local
backend, start the Django API on port `5001` and update the `API_URL`
constants in `index.html`, `login.html`, and `reports.html` to
`http://127.0.0.1:5001`. Also update the two `/send-report` fetch URLs in
`index.html`; they are written as absolute URLs. Revert those local-only URL
changes before preparing a deployment.

The frontend loads Bootstrap, Font Awesome, Google Fonts, and other browser
libraries from CDNs, so those resources require an internet connection.

## Configuration and deployment

The static pages contain the API base URL in their source. Keep it pointed at
the intended HTTPS API for each release. Never put provider API keys,
database credentials, signing secrets, or private access tokens in frontend
files; browser code and browser storage are visible to the user.

`vercel.json` contains the hosting response-header configuration. Deploy this
repository as a static site using the hosting provider's supported Git
integration or CLI. Verify the dashboard, login, reports, service-worker
assets, and API connectivity in a staging environment before promoting a
release. Do not infer backend deploy status from a successful static-site
deployment.

The service worker (`sw.js`) caches the app shell and injects the auth bridge
and responsive stylesheet into navigations. When changing the cached asset
set, update `CACHE_NAME` and verify install/activation plus a hard refresh in a
browser with an existing service-worker cache.

## Validation

There is no frontend package manifest or automated browser-test suite in this
repository. Check JavaScript syntax with Node.js:

```powershell
Get-ChildItem -Filter *.js -Recurse | ForEach-Object { node --check $_.FullName }
```

Then perform a manual smoke test in a browser: load the dashboard, sign in,
send a chat message, check a recommendation request, navigate to reports, and
confirm service-worker updates. For image analysis, use a small supported
sample and a backend configured with Gemini. Backend tests and API setup are
documented in the [backend repository](https://github.com/aicareerrecommender-alt/career-backend).

## Documentation

- [Student User Guide](USER_GUIDE.md)
- [Authentication Integration](AUTHENTICATION.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Support](SUPPORT.md)
- [Changelog](CHANGELOG.md)

## Privacy and licensing

Previous-chat transcripts and saved profile values are stored in this browser
and may not transfer to another device. Saved reports are also sent to the
backend and associated with the account. Messages and attachments are sent to
the configured backend for processing. Avoid sharing information you do not
want processed by the service, and verify AI-generated admissions guidance
with official sources.

No license is declared in this repository. Contact the repository owner before
redistributing or reusing its contents.
