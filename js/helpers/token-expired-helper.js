function isTokenExpired(data, token, redirect){
    if(data.msg == "token expired"){
        localStorage.removeItem(token);
        sessionStorage.setItem("message", "Waktu anda telah habis, harap masuk kembali");
        location.href = redirect;
    }
    else {
        localStorage.setItem("TOKEN", JSON.stringify(data));
        location.reload();
    }
}

export {isTokenExpired};