import {BACKEND_URL, fetchAPI} from "../../helpers/api-helper.js";

const logoutATAPI = async(jwt) => {
    const ENDPOINT = `${BACKEND_URL}logout`;
    return fetchAPI(ENDPOINT, null, 'DELETE', jwt);
}

const logoutRTAPI = async(jwt) => {
    const ENDPOINT = `${BACKEND_URL}logout2`;
    return fetchAPI(ENDPOINT, null, 'DELETE', jwt);
}

export {logoutATAPI, logoutRTAPI};