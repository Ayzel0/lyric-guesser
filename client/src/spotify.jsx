import axios from 'axios';

/**
 * function to get the access token from our url parameters when we get redirected to the React website.
 * @returns {string} access token
 */
const getAccessToken = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('access_token');
}

export const accessToken = getAccessToken()

/**
 * AXIOS HANDLING
 */

// axios defaults
axios.defaults.baseURL = 'http://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';