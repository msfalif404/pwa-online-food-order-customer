import {BACKEND_URL, fetchAPI} from "../../../helpers/api-helper.js";

const loginCustomerAPI = async (email, password) => {
    const ENDPOINT = `${BACKEND_URL}login`;
    const bodyValue = JSON.stringify({
        username: email,
        pasw: password
    });
    return fetchAPI(ENDPOINT, bodyValue, 'POST', null);
}

const registerCustomerAPI = async (name, phone, birthday, gender, email, password) => {
    const ENDPOINT = `${BACKEND_URL}register`;
    const bodyValue = JSON.stringify({
        email: email,
        phone: phone,
        name: name,
        gender: gender,
        birthday: birthday,
        pasw: password
    });
    return fetchAPI(ENDPOINT, bodyValue, 'POST', null);
}

const forgotPasswordCustomerAPI = async (email) => {
    const ENDPOINT = `${BACKEND_URL}forgot_password`;
    const bodyValue = JSON.stringify({
        email: email,
    });
    return fetchAPI(ENDPOINT, bodyValue, 'POST', null);
}

const verifyCustomerOTPAPI = async (key, otp) => {
    const ENDPOINT = `${BACKEND_URL}verify_otp`;
    const bodyValue = JSON.stringify({
        key: key,
        otp: otp
    });
    return fetchAPI(ENDPOINT, bodyValue, 'POST', null);
}

const resendOTPAPI = async (name, email) => {
    const ENDPOINT = `${BACKEND_URL}resend/otp?name=${name}&email=${email}`;
    return fetchAPI(ENDPOINT, null, 'GET', null);
}

export {loginCustomerAPI, registerCustomerAPI, forgotPasswordCustomerAPI, verifyCustomerOTPAPI, resendOTPAPI};