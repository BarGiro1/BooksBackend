$(document).ready(function () {
    fetchUsers();

    $('#search-input').on('keyup', function() {
        searchTable($(this).val());
    });
});

function fetchUsers() {
    $.ajax({
        type: "POST",
        url: "http://localhost:3001/admin/users",
        data: {token: localStorage.token},
        success: function (response) {
            console.log(response);
            response.forEach(function(user) {
                addUserRow(user);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}

function addUserRow(user) {
    var row = $(`<tr data-user-id="${user._id}"></tr>`);
    
    var nameCell = $('<td>' + user.name + '</td>');
    var adminCell = $('<td>' + (user.isAdmin ? 'Yes' : 'No') + '</td>');
    var emailCell = $('<td>' + user.email + '</td>');
    var passwordCell = $('<td>' + '*'.repeat(user.password.length) + '</td>');
    var actionCell = $('<td><button class="btn btn-primary edit-btn me-2">Edit</button><button class="btn btn-danger delete-btn">Delete</button></td>');
    
    row.append(nameCell, adminCell, emailCell, passwordCell, actionCell);
    
    $('.users').append(row);

    attachEditFunctionality(row, user);
    attachDeleteFunctionality(row, user);
}

function attachEditFunctionality(row, user) {
    var nameCell = row.children().eq(0);
    var adminCell = row.children().eq(1);
    var emailCell = row.children().eq(2);
    var passwordCell = row.children().eq(3);
    var actionCell = row.children().eq(4);

    actionCell.find('.edit-btn').click(function() {
        nameCell.html('<input type="text" name="name" value="' + user.name + '">');
        adminCell.html('<input type="checkbox" name="isAdmin" ' + (user.isAdmin ? 'checked' : '') + '>');
        emailCell.html('<input type="email" name="email" value="' + user.email + '">');
        passwordCell.html('<input type="password" name="password" value="' + user.password + '">');
        actionCell.html('<button class="btn btn-success save-btn me-2">Save</button><button class="btn btn-secondary cancel-btn">Cancel</button>');

        attachSaveCancelFunctionality(row, user);
    });
}

function attachSaveCancelFunctionality(row, user) {
    var nameCell = row.children().eq(0);
    var adminCell = row.children().eq(1);
    var emailCell = row.children().eq(2);
    var passwordCell = row.children().eq(3);
    var actionCell = row.children().eq(4);

    actionCell.find('.save-btn').click(function() {
        var updatedUser = {
            _id: user._id,
            name: nameCell.find('input[name="name"]').val(),
            isAdmin: adminCell.find('input[name="isAdmin"]').is(':checked'),
            email: emailCell.find('input[name="email"]').val(),
            password: passwordCell.find('input[name="password"]').val()
        };
        
        updateUser(updatedUser, row);
    });

    actionCell.find('.cancel-btn').click(function() {
        restoreRowToNormalState(row, user);
    });
}

function updateUser(updatedUser, row) {
    $.ajax({
        type: "PUT",
        url: `http://localhost:3001/admin/users/${updatedUser._id}`,
        data: JSON.stringify({
            token: localStorage.token,
            updatedUserDetails: updatedUser
        }),
        contentType: "application/json",
        success: function (response) {
            console.log('User updated:', response);
            restoreRowToNormalState(row, updatedUser);
        },
        error: function (xhr, status, error) {
            console.error("Error updating user: " + error);
            alert("Failed to update user. Please try again.");
        }
    });
}

function restoreRowToNormalState(row, user) {
    var nameCell = row.children().eq(0);
    var adminCell = row.children().eq(1);
    var emailCell = row.children().eq(2);
    var passwordCell = row.children().eq(3);
    var actionCell = row.children().eq(4);

    nameCell.text(user.name);
    adminCell.text(user.isAdmin ? 'Yes' : 'No');
    emailCell.text(user.email);
    passwordCell.text('*'.repeat(user.password.length));
    actionCell.html('<button class="btn btn-primary edit-btn me-2">Edit</button><button class="btn btn-danger delete-btn">Delete</button>');

    attachEditFunctionality(row, user);
    attachDeleteFunctionality(row, user);
}

function attachDeleteFunctionality(row, user) {
    row.find('.delete-btn').click(function() {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(user._id, row);
        }
    });
}

function deleteUser(userId, row) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/admin/users/${userId}`,
        data: {token: localStorage.token},
        success: function (response) {
            console.log(response);
            row.remove();
        },
        error: function (xhr, status, error) {
            console.error("Error deleting user: " + error);
            alert("Failed to delete user. Please try again.");
        }
    });
}

function searchTable(query) {
    query = query.toLowerCase();
    $('.users tr').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
    });
}