$(document).ready(function () {
    fetchBranches();
    addBranchInputRow();
});

function fetchBranches() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3001/branches",
        success: function (response) {
            console.log(response);
            response.forEach(function(branch) {
                addBranchRow(branch);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error: " + errorThrown);
        }
    });
}

function addBranchRow(branch = {}) {
    var row = $(`<tr data-branch-id="${branch._id || ''}"></tr>`);
    
    var nameCell = $('<td>' + (branch.name || '') + '</td>');
    var cityCell = $('<td>' + (branch.address.city || '') + '</td>');
    var countryCell = $('<td>' + (branch.address.country || '') + '</td>');
    var latitudeCell = $('<td>' + (branch.address.latitude || '') + '</td>');
    var longitudeCell = $('<td>' + (branch.address.longitude || '') + '</td>');
    var streetCell = $('<td>' + (branch.address.street || '') + '</td>');
    var actionCell = $('<td class="d-flex"><button class="btn btn-primary edit-btn me-2">Edit</button><button class="btn btn-danger delete-btn">Delete</button></td>');
    
    row.append(nameCell, cityCell, countryCell, latitudeCell, longitudeCell, streetCell, actionCell);
    
    $('.branches').append(row);

    attachEditFunctionality(row, branch);
    attachDeleteFunctionality(row, branch);
}

function addBranchInputRow() {
    var row = $('<tr></tr>');
    
    var nameCell = $('<td><input type="text" name="name" placeholder="Branch Name"></td>');
    var cityCell = $('<td><input type="text" name="city" placeholder="City"></td>');
    var countryCell = $('<td><input type="text" name="country" placeholder="Country"></td>');
    var latitudeCell = $('<td><input type="text" name="latitude" placeholder="Latitude"></td>');
    var longitudeCell = $('<td><input type="text" name="longitude" placeholder="Longitude"></td>');
    var streetCell = $('<td><input type="text" name="street" placeholder="Street"></td>');
    var actionCell = $('<td><button class="btn btn-success add-btn">Add</button></td>');
    
    row.append(nameCell, cityCell, countryCell, latitudeCell, longitudeCell, streetCell, actionCell);
    
    $('.branches').prepend(row);

    actionCell.find('.add-btn').click(function() {
        var newBranch = {
            name: nameCell.find('input[name="name"]').val(),
            address: {
                city: cityCell.find('input[name="city"]').val(),
                country: countryCell.find('input[name="country"]').val(),
                latitude: latitudeCell.find('input[name="latitude"]').val(),
                longitude: longitudeCell.find('input[name="longitude"]').val(),
                street: streetCell.find('input[name="street"]').val()
            }
        };
        addNewBranch(newBranch);
    });
}

function addNewBranch(branch) {
    $.ajax({
        type: "POST",
        url: "http://localhost:3001/branches",
        data: JSON.stringify(branch),
        contentType: "application/json",
        success: function (response) {
            console.log('Branch added:', response);
            addBranchRow(response);
            $('.branches tr:first-child input').val(''); // Clear input fields
        },
        error: function (xhr, status, error) {
            console.error("Error adding branch: " + error);
            alert("Failed to add branch. Please try again.");
        }
    });
}

function attachEditFunctionality(row, branch) {
    var nameCell = row.children().eq(0);
    var cityCell = row.children().eq(1);
    var countryCell = row.children().eq(2);
    var latitudeCell = row.children().eq(3);
    var longitudeCell = row.children().eq(4);
    var streetCell = row.children().eq(5);
    var actionCell = row.children().eq(6);

    actionCell.find('.edit-btn').click(function() {
        nameCell.html('<input type="text" name="name" value="' + (branch.name || '') + '">');
        cityCell.html('<input type="text" name="city" value="' + (branch.address.city || '') + '">');
        countryCell.html('<input type="text" name="country" value="' + (branch.address.country || '') + '">');
        latitudeCell.html('<input type="text" name="latitude" value="' + (branch.address.latitude || '') + '">');
        longitudeCell.html('<input type="text" name="longitude" value="' + (branch.address.longitude || '') + '">');
        streetCell.html('<input type="text" name="street" value="' + (branch.address.street || '') + '">');
        actionCell.html('<div class="d-flex"><button class="btn btn-success save-btn me-2">Save</button><button class="btn btn-secondary cancel-btn">Cancel</button></div>');

        attachSaveCancelFunctionality(row, branch);
    });
}

function attachSaveCancelFunctionality(row, branch) {
    var nameCell = row.children().eq(0);
    var cityCell = row.children().eq(1);
    var countryCell = row.children().eq(2);
    var latitudeCell = row.children().eq(3);
    var longitudeCell = row.children().eq(4);
    var streetCell = row.children().eq(5);
    var actionCell = row.children().eq(6);

    actionCell.find('.save-btn').click(function() {
        var updatedBranch = {
            _id: branch._id,
            name: nameCell.find('input[name="name"]').val(),
            address: {
                city: cityCell.find('input[name="city"]').val(),
                country: countryCell.find('input[name="country"]').val(),
                latitude: latitudeCell.find('input[name="latitude"]').val(),
                longitude: longitudeCell.find('input[name="longitude"]').val(),
                street: streetCell.find('input[name="street"]').val()
            }
        };
        
        updateBranch(updatedBranch, row);
    });

    actionCell.find('.cancel-btn').click(function() {
        restoreRowToNormalState(row, branch);
    });
}

function updateBranch(updatedBranch, row) {
    $.ajax({
        type: "PUT",
        url: `http://localhost:3001/branches/${updatedBranch._id}`,
        data: JSON.stringify(updatedBranch),
        contentType: "application/json",
        success: function (response) {
            console.log('Branch updated:', response);
            restoreRowToNormalState(row, updatedBranch);
        },
        error: function (xhr, status, error) {
            console.error("Error updating branch: " + error);
            alert("Failed to update branch. Please try again.");
        }
    });
}

function restoreRowToNormalState(row, branch) {
    var nameCell = row.children().eq(0);
    var cityCell = row.children().eq(1);
    var countryCell = row.children().eq(2);
    var latitudeCell = row.children().eq(3);
    var longitudeCell = row.children().eq(4);
    var streetCell = row.children().eq(5);
    var actionCell = row.children().eq(6);

    nameCell.text(branch.name || '');
    cityCell.text(branch.address.city || '');
    countryCell.text(branch.address.country || '');
    latitudeCell.text(branch.address.latitude || '');
    longitudeCell.text(branch.address.longitude || '');
    streetCell.text(branch.address.street || '');
    actionCell.html('<div class="d-flex"><button class="btn btn-primary edit-btn me-2">Edit</button><button class="btn btn-danger delete-btn">Delete</button></div>');

    attachEditFunctionality(row, branch);
    attachDeleteFunctionality(row, branch);
}

function attachDeleteFunctionality(row, branch) {
    row.find('.delete-btn').click(function() {
        if (confirm('Are you sure you want to delete this branch?')) {
            deleteBranch(branch._id, row);
        }
    });
}

function deleteBranch(branchId, row) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/branches/${branchId}`,
        success: function (response) {
            console.log(response);
            row.remove();
        },
        error: function (xhr, status, error) {
            console.error("Error deleting branch: " + error);
            alert("Failed to delete branch. Please try again.");
        }
    });
}