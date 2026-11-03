/*
 * Auth bridge for the legacy static frontend.
 * Captures backend-issued bearer tokens from sign-in/verification responses,
 * then attaches the token to /recommend without exposing provider API keys.
 */
(() => {
    if (window.__careerAuthBridgeInstalled) return;
    window.__careerAuthBridgeInstalled = true;

    const TOKEN_KEY = 'career_access_token';
    const originalFetch = window.fetch.bind(window);

    function getUrl(input) {
        try {
            return new URL(typeof input === 'string' ? input : input.url, window.location.href);
        } catch (_) {
            return null;
        }
    }

    window.fetch = async (input, init = {}) => {
        const url = getUrl(input);
        const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
        const isRecommendation = url && url.pathname.replace(/\/$/, '') === '/recommend';
        const token = sessionStorage.getItem(TOKEN_KEY);

        if (isRecommendation) {
            if (!token) {
                window.location.assign('login.html');
                return new Response(JSON.stringify({
                    error: 'Please sign in again to continue.',
                    code: 'authentication_required'
                }), { status: 401, headers: { 'Content-Type': 'application/json' } });
            }
            headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await originalFetch(input, { ...init, headers });

        const isAuthResponse = url && url.origin === new URL(window.location.href).origin
            ? false
            : url && ['login', 'google-login', 'verify'].includes(url.pathname.replace(/^\//, ''));
        if (isAuthResponse && response.ok) {
            try {
                const body = await response.clone().json();
                if (body.access_token) {
                    sessionStorage.setItem(TOKEN_KEY, body.access_token);
                    if (body.user && body.user.email) sessionStorage.setItem('career_user_email', body.user.email);
                    else if (body.email) sessionStorage.setItem('career_user_email', body.email);
                }
            } catch (error) {
                console.warn('Could not read sign-in token response.', error);
            }
        }

        if (isRecommendation && response.status === 401) {
            sessionStorage.removeItem(TOKEN_KEY);
            window.location.assign('login.html');
        } else if (isRecommendation && response.status === 402) {
            try {
                const body = await response.clone().json();
                window.alert(body.funding_message || body.error || 'Please request funding to continue.');
            } catch (_) {
                window.alert('You have used the complimentary recommendations. Please request funding to continue.');
            }
        }

        return response;
    };
})();
