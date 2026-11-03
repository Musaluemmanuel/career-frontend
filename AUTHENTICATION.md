# Frontend authentication integration

The static app loads `auth-bridge.js` through its service worker. It captures the signed `access_token` returned by the backend after password login, Google login, or verification, keeps it in tab-scoped `sessionStorage`, and adds `Authorization: Bearer ...` to `/recommend` calls. It does not contain or expose the Groq API key.

The backend allows three authenticated recommendation attempts per account. A fourth request receives HTTP 402 and the bridge displays the funding-required message. Sign out clears the app's local auth state; close the browser tab to discard the tab-scoped bearer token.

After deployment, reload the app once to let the service worker install its updated version. If an already-open tab is still controlled by the old worker, close and reopen it or hard-refresh once. Test with an account on staging before production.
