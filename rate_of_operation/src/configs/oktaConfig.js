import { OktaAuth } from '@okta/okta-auth-js';
export const oktaAuth = new OktaAuth({
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
    issuer: process.env.REACT_APP_OKTA_URL,
    redirectUri: `${window.location.origin}/login/callback`,
    scopes: ['openid', 'profile', 'groups', 'email']
});
