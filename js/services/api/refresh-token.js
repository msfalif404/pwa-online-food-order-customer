import {BACKEND_URL, fetchAPI} from "../../helpers/api-helper.js";

const refreshTokenAPI = async(jwt) => {
    const ENDPOINT = `${BACKEND_URL}token/refresh`;
    return fetchAPI(ENDPOINT, null, 'POST', jwt);
}

export {refreshTokenAPI};