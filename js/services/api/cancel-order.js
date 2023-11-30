// Cancel order by cashier or customer

import {BACKEND_URL, fetchAPI} from "../../helpers/api-helper.js";

const cancelOrderAPI = async (code, reason, jwt) => {
    const ENDPOINT = `${BACKEND_URL}order/cancel/${code}`;
    const bodyValue = JSON.stringify({
        reason: reason,
    });
    return fetchAPI(ENDPOINT, bodyValue, 'PUT', jwt);
}

export {cancelOrderAPI};