import {authProvider, scopes} from '../authProvider';
import CacheManager from './CachecManager';

var graph = require('@microsoft/microsoft-graph-client');
export async function getAuthenticatedClient(accessToken) {
    let isCahce = false,
        validToken = '',
        newAccInfo = {},
        accountInfo = {};
    try {
        isCahce = CacheManager.isCacheExpired('accountInfo');
    } catch (err) {
        console.log(err);
        isCahce = false;
    }
    if (isCahce && accessToken) {
        validToken = accessToken;
    } else {
        try {
            newAccInfo = await authProvider.acquireTokenSilent(scopes);
            const cacheAccountInfo = CacheManager.getCacheItem('accountInfo');
            accountInfo = JSON.parse(cacheAccountInfo.value);
            accountInfo.jwtAccessToken = newAccInfo.accessToken;
            accountInfo.account = newAccInfo.account;
            CacheManager.updateCacheItem(
                'accountInfo',
                JSON.stringify(accountInfo),
                1,
            );
            validToken = newAccInfo.accessToken;
        } catch (err) {
            console.log('account Info error', err);
            newAccInfo = await authProvider.acquireTokenSilent(scopes);
            const cacheAccountInfo = CacheManager.getCacheItem('accountInfo');        
            accountInfo = JSON.parse(cacheAccountInfo.value);
            accountInfo.jwtAccessToken = newAccInfo.accessToken;
            accountInfo.account = newAccInfo.account;
            CacheManager.updateCacheItem(
                'accountInfo',
                JSON.stringify(accountInfo),
                72
            );
            validToken = newAccInfo.accessToken;
        }
    }
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
        debugLogging: true,
        authProvider: done => {
            done(null, validToken);
        },
    });
    return client;
}

export function searchForOnlyPeople(searchText, accessToken) {
    const client = getAuthenticatedClient(accessToken);
    return new Promise((resolve, reject) => {
        client
            .api('/users')
            .filter(`startswith(displayName,'${searchText}')`)
            .select('displayName,givenName,surname,mail,userPrincipalName,id')
            .top(25)
            .get((err, res) => {
                if (err) {
                    //this._handleError(err);
                    reject(err.message);
                    return;
                }
                //callback(err, (res) ? res.value : []);
                resolve(res ? res.value : []);
                return;
            });
    });
}

export async function searchForPeople(searchText, accessToken) {
    const client = await getAuthenticatedClient(accessToken);
    const users = client
        .api('/users')
        .filter(`startswith(displayName,'${searchText}')`)
        .select('displayName,givenName,surname,mail,userPrincipalName,id')
        .top(25)
        .get();
    const groups = client
        .api('/groups')
        .filter(
            `startswith(displayName,'${searchText}') and groupTypes/any(c:c+eq+'Unified')`,
        )
        .select('displayName,givenName,surname,mail,userPrincipalName,id')
        .top(25)
        .get();
    return Promise.all([users, groups]).then(requestData => {
        const newData = [].concat.apply(
            [],
            requestData.map(data => (data.value.length > 0 ? data.value : [])),
        );
        //resolve(requestData);
        return newData;
    });
}

// GET user/id/photo/$value for each person
export async function getProfilePics(personas, accessToken) {
    const client =  await getAuthenticatedClient(accessToken);
    return new Promise((resolve, reject) => {
        client
            .api(`users/${personas.props.id}/photo/$value`)
            .header('Cache-Control', 'no-cache')
            .responseType('blob')
            .get((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    personas.imageUrl = window.URL.createObjectURL(res);
                    personas.initialsColor = null;
                }
            });
    });
}

// GET me/people
export async function getPeople(accessToken) {
    const client = await getAuthenticatedClient(accessToken);
    return new Promise((resolve, reject) => {
        client
            .api('/me/people')
            .filter("personType/class eq 'Person'")
            .select(
                'displayName,givenName,surname,scoredEmailAddresses,userPrincipalName',
            )
            .top(25)
            .get((err, res) => {
                if (err) {
                    reject(err.message);
                    return;
                }
                resolve(res ? res.value : []);
                return;
            });
    });
}
