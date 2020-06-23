import {MsalAuthProvider, LoginType} from 'react-aad-msal';

export const scopes = {
    scopes: ['user.read', 'people.read'],
};
export const authProvider = new MsalAuthProvider(
    {
        auth: {
            authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AAD_TENANT_ID}`,
            clientId: process.env.REACT_APP_AAD_CLIENT_ID,
            postLogoutRedirectUri: window.location.origin,
            redirectUri: window.location.origin,
            validateAuthority: true,

            // After being redirected to the "redirectUri" page, should user
            // be redirected back to the Url where their login originated from?
            navigateToLoginRequestUrl: false,
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: true,
        },
    },
    scopes,
    {
        loginType: LoginType.Redirect,
    },
    {
        tokenRefreshUri: window.location.origin + '/auth.html',
    },
);
