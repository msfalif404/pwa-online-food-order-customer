import {BACKEND_URL, fetchAPI} from "../../../helpers/api-helper.js";


const productReviewAPI = async (codeOrder, menuId, customerId, star, reason, jwt) => {
    const ENDPOINT = `${BACKEND_URL}menu/raiting`;
    const bodyValue = JSON.stringify({
        codeOrder: codeOrder,
        menuID: menuId,
        customerID: customerId,
        star: star,
        reason: reason
    });
    console.log(bodyValue);
    return fetchAPI(ENDPOINT, bodyValue, 'POST', jwt);
}

export {productReviewAPI};