import axios from 'axios';

// keys for the localstorage key-value pairs
const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'spotify_token_expire_time',
    timestamp: 'spotify_token_timestamp'
}

// values for the localstorage key-value pairs
const LOCALSTORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp)
}

/**
 * logs the current user out by clearing all localstorage items
 */
export const logout = () => {
    console.log('logging out!')
    for (const property in LOCALSTORAGE_KEYS) {
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }

    window.location = window.location.origin;
}

/**
 * checks whether the access token has expired by calculating diff between expiretime and timestamp
 */
const hasTokenExpired = () => {
    const {accessToken, timestamp, expireTime} = LOCALSTORAGE_VALUES

    // we either don't have an access token to expire or a timestamp to check expiry
    if (!accessToken || !timestamp) {
        return false;
    }

    const millisecondsElapsed = Date.now() - Number(timestamp);
    return (millisecondsElapsed/1000) > Number(expireTime);
}

/**
 * Uses the refresh token saved in local storage to hit the /refresh_token endpoint and update 
 * data in localStorage
 * @returns {void}
 */
const refreshToken = async () => {
    console.log('refreshing token');
    try {
        // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
        if (!LOCALSTORAGE_VALUES.refreshToken ||
            LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
            (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000
        ) {
            console.error('No refresh token available');
            logout();
        }

        // Use `/refresh_token` endpoint from our Node app
        const { data } = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);

        // Update localStorage values
        window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

        // Reload the page for localStorage updates to be reflected
        window.location.reload();
    } catch (e) {
        console.log('error in refreshToken function');
        console.error(e);
    }
}

/**
 * function to get the access token from our url parameters when we get redirected to the React website.
 * @returns {string} access token
 */
const getAccessToken = () => {
    console.log('getting access token');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {
        [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
        [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
        [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    }

    const hasError = urlParams.get('error');

    if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
        refreshToken();
    }

    if(LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
        console.log(LOCALSTORAGE_VALUES.accessToken);
        return LOCALSTORAGE_VALUES.accessToken;
    }

    if(queryParams[LOCALSTORAGE_KEYS.accessToken]) {
        for(const property in queryParams) {
            window.localStorage.setItem(property, queryParams[property]);
        }

        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

        return queryParams[LOCALSTORAGE_KEYS.accessToken]
    }

    return false;
}

export const accessToken = getAccessToken();

/**
 * AXIOS HANDLING
 */
axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';

// gets current user profile
export const getCurrentUserProfile = () => axios.get('/me');

// gets current user playlists. defaults to the first 20 playlists
export const getCurrentUserPlaylists = (limit = 20) => {
    return axios.get(`/me/playlists?limit=${limit}`);
}