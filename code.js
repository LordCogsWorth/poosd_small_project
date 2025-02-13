const urlBase = "http://POOSD_Small.ihardcodebubblesort.com/LAMPAPI";
const extention = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let companyName = "";
let phoneNum = 0;
let email = "";

// login and password here are for creating a new user
let login = "";
let password = "";

function addUser() {
    // This section grabs the text inputed into the fields when adding a user
    let newFirstName = document.getElementById("newFirstNameField").value;
    let newLastName = document.getElementById("newLastNameField").value;
    let newCompanyName = document.getElementById("newCompanyNameField").value;
    let newPhoneNum = document.getElementById("newPhoneNumField").value;
    let newEmail = document.getElementById("newEmailField").value;

    let newLogin = document.getElementById("createLoginField").value;
    let newPassword = document.getElementById("createPasswordField").value;

    document.getElementById("userAddResult").innerHTML = "";
  
    let tmp = {user_login:newLogin, user_password:newPassword, user_email:newEmail, user_firstName:newFirstName, user_lastName:newLastName, user_company:newCompanyName, user_phone_num:newPhoneNum};
    let jsonPayload = JSON.stringify(tmp);
    
    let url = urlBase + '/AddUser' + extention;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("userAddResult").innerHTML = "User Added";
            }
        };
        xhr.send(jsonPayload);  // This sends the add user request to the database
    }
    catch(err) {
        // TODO: Display error message for any blank fields
        // TODO: Or only display error if name and email is blank since that is the minimum information needed for each contact
        // By default this just displays a single error message if the add user request is rejected for any reason
        document.getElementById("userAddResult").innerHTML = err.message;
    }
}

function searchContacts() {
    // assuming the field for searching is called searchField
    let searchQuery = document.getElementById("searchField").value;
    document.getElementById("searchResults").innerHTML = "";

    let tmp = { search: searchQuery, userId: userID };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/SearchContact." + extention;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                
                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("searchResults").innerHTML = jsonObject.error;
                    return;
                }

                let results = jsonObject.results;
                let output = "<ul>";
                for (let i = 0; i < results.length; i++) {
                    output += "<li>" + results[i] + "</li>";
                }
                output += "</ul>";

                document.getElementById("searchResults").innerHTML = output;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("searchResults").innerHTML = err.message;
    }
}

function addContact() {
    let newFirstName = document.getElementById("AddContactFirstNameField").value;
    let newLastName = document.getElementById("AddContactLastNameField").value;
    let newEmail = document.getElementById("AddContactEmailField").value;
    let newPhoneNum = document.getElementById("AddContactPhoneField").value;
    let newCompanyName = document.getElementById("AddContactCompanyField").value;
    let newNotes = document.getElementById("AddContactNotesField").value;

    let tmp = {first_name:newFirstName,last_name:newLastName,contact_email:newEmail,contact_phone_number:newPhoneNum,contact_company:newCompanyName,notes:newNotes,user_id:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extention; // Connects to the AddContact.php file

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("AddContactResult").innerHTML = "Contact added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        document.getElementById("AddContactResult").innerHTML = err.message;
    }
}

function updateContact() {
    let contactId = document.getElementById("contactIdField").value; // Hidden field
    let updatedFirstName = document.getElementById("updateFirstNameField").value;
    let updatedLastName = document.getElementById("updateLastNameField").value;
    let updatedEmail = document.getElementById("updateEmailField").value;
    let updatedPhone = document.getElementById("updatePhoneField").value;
    let updatedCompany = document.getElementById("updateCompanyField").value;

    document.getElementById("updateResult").innerHTML = "";

    let tmp = { 
        id: contactId,
        userId: userID,
        firstName: updatedFirstName,
        lastName: updatedLastName,
        email: updatedEmail,
        phone: updatedPhone,
        company: updatedCompany
    };
    
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/UpdateContact." + extention;

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                
                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("updateResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("updateResult").innerHTML = "Contact updated successfully";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("updateResult").innerHTML = err.message;
    }
}

function deleteContact() {
    // ! I'm not sure that this actually gets the right value
    let delContactId = document.getElementById("DeleteButton").value;

    let tmp = {contact_id:delContactId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extention;  // Connects to DeleteContact.php

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("deleteResult").innerHTML = "Contact deleted";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        document.getElementById("deleteResult").innerHTML = err.message;
    }
}

function loadContacts() {
    //This function will load all contacts as soon as the page is loaded for the first time
    
    // Terminate if user not logged in properly
    if (userId < 0) {
        return;
    }

    //Load JSON for search
    let tmp = {search:"", user_id:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/SearchContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("contactsList").innerHTML = jsonObject.error;
                    return;
                }

                let results = jsonObject.results;
                let output = "<ul>";
                for (let i=0; i<results.length; i++) {
                    output += `<li>${results[i].first_name} ${results[i].last_name} - ${results[i].contact_email} - ${results[i].contact_phone_number}</li>`;
                }
                output += "<ul>";

                document.getElementById("contactsList").innerHTML = output;
            }
        };
        xhr.send(jsonPayload);  // This sends the add user request to the database
    }
    catch(err) {
        // TODO: Or only display error if name and email is blank since that is the minimum information needed for each contact
        // By default this just displays a single error message if the add user request is rejected for any reason
        document.getElementById("contactsList").innerHTML = err.message;
    }
}

