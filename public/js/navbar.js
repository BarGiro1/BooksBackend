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
    } else {
        $(".navbar-loggedin").removeClass("d-none")
        $(".navbar-logout").removeClass("d-none")
    }

    if (isAdmin) {
        $(".navbar-admin").removeClass("d-none");
    }

    $('#logout').on('click', function () {
        localStorage.removeItem("token");
        location.reload()

    });
});