$(document).ready(function () {
    let decodedJWT, isAdmin, validJWT;
    
    if (localStorage.token) {
        decodedJWT = jwtDecodeAndValidate(localStorage.token);
        isAdmin = decodedJWT.payload && decodedJWT.payload.isAdmin;
        validJWT = decodedJWT.valid;
    } else {
        decodedJWT = { valid: false, error: 'No token in localStorage' };
        isAdmin = false;
        validJWT = false;
    }

    if (!validJWT) {
        $(".navbar-login").removeClass("d-none");
    }

    if (isAdmin) {
        $(".navbar-admin").removeClass("d-none");
    }

});