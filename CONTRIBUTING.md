# Contributing

Thank you for helping improve CareerPath AI. The frontend is a static HTML,
CSS, and JavaScript application that integrates with a separately deployed
Django backend.

## Before making a change

1. Check existing issues or discuss substantial changes with the maintainers.
2. Keep changes scoped to the frontend unless an API change is also required.
3. Never commit secrets, user data, generated credentials, or local-only API
   URLs.
4. For endpoint or authentication changes, coordinate with the
   [backend repository](https://github.com/aicarecommender-alt/career-backend)
   and update the frontend/backend documentation together.

## Local development and checks

Run the app over HTTP so the service worker works:

```powershell
python -m http.server 8765
```

Check JavaScript syntax:

```powershell
Get-ChildItem -Filter *.js -Recurse | ForEach-Object { node --check $_.FullName }
```

Manually test the pages and relevant interaction in a browser at mobile and
desktop widths. Include sign-in and service-worker behavior when those
surfaces are changed. This repository does not currently define a frontend
build or automated UI-test command.

## Pull requests

- Describe the user-visible change and the reason for it.
- List manual and automated checks performed and any checks not run.
- Add before/after screenshots for visual changes when practical.
- Call out API, environment, service-worker cache, or deployment implications.
- Update the relevant README, user, authentication, and support documentation.
- Keep secrets and personal information out of screenshots and logs.
