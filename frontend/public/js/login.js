$(document).ready(function () {
    $(".login-form").on("submit", function (e) {
        e.preventDefault();
        var email = $("#email-input").val();
        var password = $("#password-input").val();

        var data = {
            email: email,
            password: password,
        };
        
        $.ajax({
            method: "POST",
            url: "http://127.0.0.1:3001/auth/login",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
            success: function (response) {
                showModal("Success", "Sign in successfully ");
                console.log(response);
                
                localStorage.token = response.token;
                setTimeout(function() {
                    $(location).prop("href", "/");
                }, 1000 * 3);
            },
            error: function (xhr, status, error) {
                var errorMessage = "An error occurred.";
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                }
                showModal("Error", errorMessage);
            },
        });
    });
});
