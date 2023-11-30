import {BACKEND_URL, fetchAPI} from "../../../helpers/api-helper.js";


const getProductOrderAPI = async (jwt) => {
    const ENDPOINT = `${BACKEND_URL}order`;
    return fetchAPI(ENDPOINT, null, 'GET', jwt);
}
const productOrderAPI = async (latitude, longitude, address, note, fee, finalPrice, orderList, jwt) => {
    const ENDPOINT = `${BACKEND_URL}order`;
    const bodyValue = JSON.stringify({
        latitude: latitude,
        longitude: longitude,
        address: address,
        note: note,
        fee: fee,
        finalPrice: finalPrice,
        orderList: orderList
    });
    return fetchAPI(ENDPOINT, bodyValue, 'POST', jwt);
}

export {getProductOrderAPI, productOrderAPI};