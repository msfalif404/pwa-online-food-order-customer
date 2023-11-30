import {BACKEND_URL, fetchAPI} from "../../helpers/api-helper.js";

const getProductDetail = async (id, jwt) => {
    const ENDPOINT = `${BACKEND_URL}menu/${id}`;
    return fetchAPI(ENDPOINT, null, 'GET', jwt);
}

export {getProductDetail};