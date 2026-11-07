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
        const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        if (token && !localStorage.getItem(TOKEN_KEY)) localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem(TOKEN_KEY);

        if (isRecommendation) {
            if (!token) {
                return new Response(JSON.stringify({
                    error: 'Your secure server session is missing. Please sign in again to run an analysis; your saved chat is still available.',
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
                    localStorage.setItem(TOKEN_KEY, body.access_token);
                    if (body.user && body.user.email) localStorage.setItem('career_user_email', body.user.email);
                    else if (body.email) localStorage.setItem('career_user_email', body.email);
                    sessionStorage.removeItem(TOKEN_KEY);
                    sessionStorage.removeItem('career_user_email');
                }
            } catch (error) {
                console.warn('Could not read sign-in token response.', error);
            }
        }

        if (isRecommendation && response.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('career_user_email');
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem('career_user_email');
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
