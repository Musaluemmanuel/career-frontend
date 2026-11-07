# Frontend authentication integration

The dashboard loads `auth-bridge.js` directly, while the service worker makes
it available on other eligible pages when needed. It captures the signed
`access_token` returned by the backend after verified password login, Google
login, or verification, keeps it in tab-scoped `sessionStorage`, and adds the
bearer `Authorization` header to `/recommend` calls. It does not contain or
expose provider API keys.

The backend allows three authenticated recommendation attempts per account.
A fourth request receives HTTP 402 and the bridge displays the
funding-required message. Sign out clears the app's local auth state; closing
the browser tab discards its tab-scoped bearer token. This token is still
sensitive while the tab is open; do not copy it into logs, URLs, or support
requests.

After a frontend deployment, reload the app to let the service worker install
its updated version. If an already-open tab is still controlled by the old
worker, close and reopen it or hard-refresh once. Test the authentication flow
with a staging account before production.

The bridge attaches the token only to recommendation requests. Other API
routes do not automatically receive it. Review backend authorization
requirements in the
[API guide](https://github.com/aicareerrecommender-alt/career-backend/blob/main/docs/API.md).
