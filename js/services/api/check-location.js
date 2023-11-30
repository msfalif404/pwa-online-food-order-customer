import {BACKEND_URL, fetchAPI} from "../../helpers/api-helper.js";

const checkLocation = (latitude, longitude) => {
    const ENDPOINT = `${BACKEND_URL}check_location?lat=${latitude}&lon=${longitude}`;
    return fetchAPI(ENDPOINT, null, 'GET');
}

export {checkLocation};

