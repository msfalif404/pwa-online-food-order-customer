import {BACKEND_URL, fetchAPI} from "../../helpers/api-helper.js";

const getAllProductIndex = async (jwt) => {
    const ENDPOINT = `${BACKEND_URL}menu`;
    return fetchAPI(ENDPOINT, null, 'GET', jwt);
}

export {getAllProductIndex};