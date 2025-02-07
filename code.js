const urlBase = "http://POOSD_Small.ihardcodebubblesort.com/LAMPAPI";
const extention = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let companyName = "";
let phoneNum = 0;
let email = "";
let bday = "";

// login and password here are for creating a new user
let login = "";
let password = "";

function addUser() {
    // This section grabs the text inputed into the fields when adding a user
    let newUserId = document.getElementById("userIdText").value; // This would only be needed if there is an input field for ID
    let newFirstName = document.getElementById("newFirstNameField").value;
    let newLastName = document.getElementById("newLastNameField").value;
    let newCompanyName = document.getElementById("newCompanyNameField").value;
    let newPhoneNum = document.getElementById("newPhoneNumField").value;
    let newEmail = document.getElementById("newEmailField").value;
    let newBday = document.getElementById("NewBdayField").value;

    let newLogin = document.getElementById("createLoginField").value;
    let newPassword = document.getElementById("createPasswordField").value;

    document.getElementById("userAddResult").innerHTML = "";

    let tmp = {user_id:newUserId, user_login:newLogin, user_password:newPassword, user_email:newEmail, user_firstName:newFirstName, user_lastName:newLastName, birth_date:newBday, user_company:newCompanyName, user_phone_num:newPhoneNum,};
    let jsonPayload = JSON.stringify(tmp);
    
    let url = urlBase + '/AddUser.' + extention; // Connects to AddUser.php

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function() {
            // I'm not sure what exactly the if condition means or if the values would be different for us but this was in the code.js for the colors lab
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("userAddResult").innerHTML = "User Added";
            }
        };
        xhr.send(jsonPayload);  // This sends the add user request to the database
    }
    catch(err) {
        // TODO: Or only display error if name and email is blank since that is the minimum information needed for each contact
        // By default this just displays a single error message if the add user request is rejected for any reason
        document.getElementById("userAddResult").innerHTML = err.message;
    }
}
