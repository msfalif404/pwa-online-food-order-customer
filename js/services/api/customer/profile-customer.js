import {BACKEND_URL, fetchAPI} from "../../../helpers/api-helper.js";

const getProfileCustomerAPI = async (jwt) => {
    const ENDPOINT = `${BACKEND_URL}customer/profile`;
    return fetchAPI(ENDPOINT, null, 'GET', jwt);
}

const changeProfileCustomerAPI = async (id, name, gender, birthday, jwt) => {
    const ENDPOINT = `${BACKEND_URL}customer/profile/${id}`;
    const bodyValue = JSON.stringify({
        name: name,
        gender: gender,
        birthday: birthday
    });
    return fetchAPI(ENDPOINT, bodyValue, 'PUT', jwt);
}

const changePasswordCustomerAPI = async (id, oldPass, newPass, confirmPass, jwt) => {
    const ENDPOINT = `${BACKEND_URL}/change_password/${id}`;
    const bodyValue = JSON.stringify({
        old_pass: oldPass,
        new_pass: newPass,
        confirm_pass: confirmPass
    });
    return fetchAPI(ENDPOINT, bodyValue, 'PUT', jwt);
}

export {getProfileCustomerAPI, changeProfileCustomerAPI, changePasswordCustomerAPI};