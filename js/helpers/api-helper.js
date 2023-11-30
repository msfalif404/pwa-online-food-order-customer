const BACKEND_URL = 'https://rest-orderapp.herokuapp.com/';
const fetchAPI = async (url, bodyValue, method, jwt) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': jwt != null ? `Bearer ${jwt}` : null
        }
        const body = bodyValue ?? null;
        const paramater = {
            headers: headers,
            method: method,
            body
        }
        const response = await fetch(url, paramater);
        const result = await response.json();
        if(result){
            return Promise.resolve(result);
        }
        else {
            console.log('Error', response.status);
            return Promise.reject(new Error(response.statusText));
        }
    }
    catch(error){
        console.log(error);
    }
}

export {BACKEND_URL, fetchAPI};