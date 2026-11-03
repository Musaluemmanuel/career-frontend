/* Inject shared auth and responsive assets into the static HTML pages. */
const CACHE_NAME = 'career-v5-pre-november-reports-layout';
const AUTH_BRIDGE = '/auth-bridge.js';
const RESPONSIVE_CSS = '/responsive.css';
const ASSETS = [
    './',
    './index.html',
    './login.html',
    './reports.html',
    './guide.html',
    AUTH_BRIDGE,
    RESPONSIVE_CSS,
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.mode === 'navigate' && new URL(request.url).origin === self.location.origin) {
        event.respondWith(
            fetch(request).then(async response => {
                const contentType = response.headers.get('content-type') || '';
                if (!response.ok || !contentType.includes('text/html')) return response;

                let html = await response.text();
                const injectedAssets = [
                    `<link rel="stylesheet" href="${RESPONSIVE_CSS}">`,
                    `<script src="${AUTH_BRIDGE}" defer></script>`
                ];
                for (const asset of injectedAssets) {
                    const path = asset.includes(RESPONSIVE_CSS) ? RESPONSIVE_CSS : AUTH_BRIDGE;
                    if (!html.includes(path)) {
                        html = html.includes('</body>')
                            ? html.replace('</body>', `${asset}\n</body>`)
                            : `${html}\n${asset}`;
                    }
                }

                const headers = new Headers(response.headers);
                headers.delete('content-length');
                headers.delete('content-encoding');
                return new Response(html, {
                    status: response.status,
                    statusText: response.statusText,
                    headers
                });
            }).catch(() => caches.match(request).then(cached => cached || Response.error()))
        );
        return;
    }

    event.respondWith(
        fetch(request).catch(() => caches.match(request).then(cached => cached || Response.error()))
    );
});
