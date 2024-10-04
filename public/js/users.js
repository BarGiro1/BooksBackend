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
    var row = $(`<tr data--user-id=${user._id}></tr>`);
    
    var nameCell = $('<td>' + user.name + '</td>');
    var adminCell = $('<td>' + (user.isAdmin ? 'Yes' : 'No') + '</td>');
    var emailCell = $('<td>' + user.email + '</td>');
    var passwordCell = $('<td>' + '*'.repeat(user.password.length) + '</td>'); // Display password as asterisks
    var editCell = $('<td><button class="btn btn-primary edit-btn">Edit</button></td>');
    
    row.append(nameCell, adminCell, emailCell, passwordCell, editCell);
    
    $('.users').append(row);

    attachEditFunctionality(row, user);
}

function attachEditFunctionality(row, user) {
    var nameCell = row.children().eq(0);
    var adminCell = row.children().eq(1);
    var emailCell = row.children().eq(2);
    var passwordCell = row.children().eq(3);
    var editCell = row.children().eq(4);

    editCell.find('.edit-btn').click(function() {
        // Replace text with input fields
        nameCell.html('<input type="text" name="name" value="' + user.name + '">');
        adminCell.html('<input type="checkbox" name="isAdmin" ' + (user.isAdmin ? 'checked' : '') + '>');
        emailCell.html('<input type="email" name="email" value="' + user.email + '">');
        passwordCell.html('<input type="password" name="password" value="' + user.password + '">'); // Show actual password in input
        editCell.html('<button class="btn save-btn">Save</button> <button class="btn cancel-btn">Cancel</button>');

        attachSaveCancelFunctionality(row, user);
    });
}

function attachSaveCancelFunctionality(row, user) {
    var nameCell = row.children().eq(0);
    var adminCell = row.children().eq(1);
    var emailCell = row.children().eq(2);
    var passwordCell = row.children().eq(3);
    var editCell = row.children().eq(4);

    editCell.find('.save-btn').click(function() {
        var updatedUser = {
            name: nameCell.find('input[name="name"]').val(),
            isAdmin: adminCell.find('input[name="isAdmin"]').is(':checked'),
            email: emailCell.find('input[name="email"]').val(),
            password: passwordCell.find('input[name="password"]').val()
        };
        console.log('Updated user:', updatedUser);

        nameCell.text(updatedUser.name);
        adminCell.text(updatedUser.isAdmin ? 'Yes' : 'No');
        emailCell.text(updatedUser.email);
        passwordCell.text('*'.repeat(updatedUser.password.length));
        editCell.html('<button class="btn btn-primary edit-btn">Edit</button>');

        attachEditFunctionality(row, updatedUser);
    });

    editCell.find('.cancel-btn').click(function() {
        nameCell.text(user.name);
        adminCell.text(user.isAdmin ? 'Yes' : 'No');
        emailCell.text(user.email);
        passwordCell.text('*'.repeat(user.password.length)); 
        editCell.html('<button class="btn btn-primary edit-btn">Edit</button>');

        attachEditFunctionality(row, user);
    });
}

function searchTable(query) {
    query = query.toLowerCase();
    $('.users tr').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
    });
}