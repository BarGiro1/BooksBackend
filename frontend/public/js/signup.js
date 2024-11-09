$(document).ready(function () {
    $(".signup-form").on("submit", function (e) {
        e.preventDefault();

        var username = $("#username-input").val();
        var email = $("#email-input").val();
        var password = $("#password-input").val();
        var validatePassword = $("#validate-password-input").val();

        // Basic form validation
        if (!username || !email || !password || !validatePassword) {
            showModal("Error", "Please fill in all fields.");
            return;
        }

        if (password !== validatePassword) {
            showModal("Error", "Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            showModal("Error", "Password must be at least 8 characters.");
            return;
        }

        var data = {
            name: username,
            email: email,
            password: password,
        };

        $.ajax({
            method: "POST",
            url: "http://127.0.0.1:3001/auth/register",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
            success: function (response) {
                showModal("Success", "Sign up successful! Please sign in");
                setTimeout(function() {
                    $(location).prop("href", "login");
                }, 2000);
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
