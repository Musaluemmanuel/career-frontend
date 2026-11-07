# Frontend authentication integration

The frontend stores the signed `access_token` returned by the backend after
verified password login, Google login, or verification in `localStorage`. This
keeps the session available when a mobile PWA is closed and reopened. Legacy
tokens in `sessionStorage` are migrated on the next page load. Signing in with
another account replaces the active account on that device; the login screen
also offers an explicit account-switch action. Sign out clears both current
and legacy auth state.

The backend permits multiple independent accounts and unlimited authenticated
recommendation attempts. Access tokens expire according to the backend's
`AUTH_TOKEN_TTL_SECONDS` setting. Because a persistent bearer token is
sensitive, sign out on shared devices and do not copy tokens into logs, URLs,
or support requests.

After a frontend deployment, reload the app to let the service worker install
its updated version. If an already-open tab is still controlled by the old
worker, close and reopen it or hard-refresh once. Test the authentication flow
with a staging account before production.

On deployments that load `auth-bridge.js`, it attaches the token only to
recommendation requests. Other API routes do not automatically receive it.
Review backend authorization requirements in the
[API guide](https://github.com/aicareerrecommender-alt/career-backend/blob/main/docs/API.md).
