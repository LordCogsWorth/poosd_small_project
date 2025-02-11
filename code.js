const urlBase = 'http://poosd_small.ihardcodebubblesort.com//LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let companyName = "";
let phoneNum = 0;
let email = "";

let bday = "";

function toSignup()
{
    window.location.href = "signup.html";
}

function toSignin()
{
    window.location.href = "index.html";
}

// login and password here are for creating a new user
let login = "";
let password = "";

function addUser() {
    // This section grabs the text inputed into the fields when adding a user
    //let newUserId = document.getElementById("userIdText").value; // This would only be needed if there is an input field for ID
    let newFirstName = document.getElementById("newFirstNameField").value;
    let newLastName = document.getElementById("newLastNameField").value;
    let newCompanyName = document.getElementById("newCompanyNameField").value;
    let newPhoneNum = document.getElementById("newPhoneNumField").value;
    let newEmail = document.getElementById("newEmailField").value;
    let newBday = document.getElementById("newBdayField").value;

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

function addContact() {
    let newContactId = document.getElementById("AddContactIdField").value;
    let newFirstName = document.getElementById("AddContactFirstNameField").value;
    let newLastName = document.getElementById("AddContactLastNameField").value;
    let newEmail = document.getElementById("AddContactEmailField").value;
    let newPhoneNum = document.getElementById("AddContactPhoneField").value;
    let newCompanyName = document.getElementById("AddContactCompanyField").value;
    let newNotes = document.getElementById("AddContactNotesField").value;

    let tmp = {contact_id:newContactId,first_name:newFirstName,last_name:newLastName,contact_email:newEmail,contact_phone_number:newPhoneNum,contact_company:newCompanyName,notes:newNotes,user_id:userId};
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

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					window.location.href = "color.html";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "main.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
		//window.location.href = "color.html";
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
