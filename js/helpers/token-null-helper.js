function isTokenNull(token, redirect){
    if(token == null){
        sessionStorage.setItem("message", "Waktu anda telah habis, harap masuk kembali");
        location.href = redirect;
        throw new Error("Token Expired");
    }
}

export {isTokenNull};