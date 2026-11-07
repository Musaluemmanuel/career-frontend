# Frontend architecture

## Runtime

The application is a static site with no frontend build system. The HTML pages
contain their page-specific styling and JavaScript and load selected libraries
from CDNs.

| File | Responsibility |
| --- | --- |
| `index.html` | Dashboard, chat, saved chats, profile, recommendations, and report actions. |
| `login.html` | Registration, verification, password login, and Google login. |
| `reports.html` | Saved report view. |
| `guide.html` | Static product guide. |
| `responsive.css` | Shared responsive layout rules. |
| `auth-bridge.js` | Captures sign-in tokens and adds a bearer token to recommendation requests. |
| `sw.js` | Caches the application shell and injects shared frontend assets. |

## Data flow

1. The browser serves the static pages over HTTP/HTTPS.
2. The pages call the configured API URL for account, chat, history,
   recommendation, and email operations.
3. The backend returns a signed access token after verified sign-in.
4. The service worker loads `auth-bridge.js`; the bridge stores the token in
   tab-scoped `sessionStorage` and attaches it to `/recommend`.
5. Chat drafts, previous conversations, and saved profile values use browser
   `localStorage`; they are not a cross-device backup.

The frontend is not an authorization boundary. Server-side checks must protect
sensitive API operations. See the backend [API authorization boundary](https://github.com/aicareerrecommender-alt/career-backend/blob/main/docs/API.md#authorization-boundary).

## Service-worker changes

The worker's `CACHE_NAME` identifies its cached app shell. Change it when
updating the cache asset list so existing clients install the new version.
Test first install, activation over an older cache, offline fallback, and a
hard refresh after deployment. The worker injects the auth bridge and
responsive stylesheet into same-origin HTML navigations; avoid injecting
duplicate copies into pages that already include those assets.

## Configuration boundary

The API base URL currently lives in the page scripts rather than a build-time
environment configuration. Local development therefore requires updating the
URL constants in all API-calling pages and restoring the deployed origin
before release. Do not put backend secrets in client-side configuration.
