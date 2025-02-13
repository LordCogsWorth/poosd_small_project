const urlBase = "http://POOSD_Small.ihardcodebubblesort.com/LAMPAPI";
const extention = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let companyName = "";
let phoneNum = 0;
let email = "";

function toSignup()
{
    window.location.href = "signup.html";
}

function toSignin()
{
    window.location.href = "index.html";
}

// login and password here are for creating a new user
let user_login = "";
let user_password = "";

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
  
    let tmp = {user_login:newLogin, user_password:newPassword, user_email:newEmail, first_name:newFirstName, last_name:newLastName, user_company:newCompanyName, user_phone_number:newPhoneNum};
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

function addContact() {
    let newFirstName = document.getElementById("contactFirstName").value;
    let newLastName = document.getElementById("contactLastName").value;
    let newEmail = document.getElementById("contactEmail").value;
    let newPhoneNum = document.getElementById("contactPhone").value;
    let newCompanyName = document.getElementById("contactCompany").value;
    let newNotes = document.getElementById("contactNotes").value;

    let tmp = {first_name:newFirstName,last_name:newLastName,contact_email:newEmail,contact_phone_number:newPhoneNum,contact_company:newCompanyName,notes:newNotes,user_id:userId};
    console.log(userId);
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extention; // Connects to the AddContact.php file

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("ContactAddResult").innerHTML = "Contact added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        document.getElementById("ContactAddResult").innerHTML = err.message;
    }
}

function searchContacts() {
    let searchQuery = document.getElementById("search").value;
    //document.getElementById("searchResults").innerHTML = "";

    let tmp = { search: searchQuery, userId: userId };
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
                    document.getElementById("contactTable").innerHTML = 
                        `<tr><td colspan="6">${jsonObject.error}</td></tr>`;
                    return;
                }

                let results = jsonObject.results;
                let tableBody = document.getElementById("contactTable");
                tableBody.innerHTML = ""; // Clear existing table data

                for (let i = 0; i < results.length; i++) {
                    let row = document.createElement("tr");
                    row.setAttribute("data-contact-id", results[i].id);
                    row.innerHTML = `
                        <td>${results[i].firstName} ${results[i].lastName}</td>
                        <td>${results[i].phone}</td>
                        <td>${results[i].company}</td>
                        <td>${results[i].email}</td>
                        <td>${results[i].notes ? results[i].notes : ""}</td>
                        <td>
                            <button onclick="updateContact(${results[i].id})">Edit</button>
                            <button onclick="deleteContact(${results[i].id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactTable").innerHTML = 
            `<tr><td colspan="6">${err.message}</td></tr>`;
    }
}

function updateContact(contactId) {
    let updatedFirstName = document.getElementById("updateFirstNameField").value;
    let updatedLastName = document.getElementById("updateLastNameField").value;
    let updatedEmail = document.getElementById("updateEmailField").value;
    let updatedPhone = document.getElementById("updatePhoneField").value;
    let updatedCompany = document.getElementById("updateCompanyField").value;

    document.getElementById("updateResult").innerHTML = "";

    let tmp = { 
        id: contactId,
        userId: userId,
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

function deleteContact(delContactId) {
    if (!delContactId) {
        console.error("No contact ID");
        return;
    }

    let tmp = {contact_id:delContactId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extention;  // Connects to DeleteContact.php

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //document.getElementById("deleteResult").innerHTML = "Contact deleted";
                
                // Remove the row from the table
                let rowToDelete = document.querySelector(`tr[data-contact-id="${delContactId}"]`);
                if (rowToDelete) {
                    rowToDelete.remove();
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        //document.getElementById("deleteResult").innerHTML = err.message;
    }
}

function loadContacts() {
    //This function will load all contacts as soon as the page is loaded for the first time
    
    // Terminate if user not logged in properly
    if (userId < 0) {
        return;
    }

    //Load JSON for search
    let tmp = {search:"", userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/SearchContact." + extention;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("contactTable").innerHTML = `<tr><td colspan="6">${jsonObject.error}</td></tr>`;
                    return;
                }

                let results = jsonObject.results;
                let tableBody = document.getElementById("contactTable");
                tableBody.innerHTML = ""; // Clear previous entries

                // Insert each contact as a new table row
                for (let i = 0; i < results.length; i++) {
                    let row = document.createElement("tr");
                    row.setAttribute("data-contact-id", results[i].id);
                    row.innerHTML = `
                        <td>${results[i].firstName} ${results[i].lastName}</td>
                        <td>${results[i].phone}</td>
                        <td>${results[i].company || "N/A"}</td>
                        <td>${results[i].email}</td>
                        <td>${results[i].notes || "N/A"}</td>
                        <td>
                            <button onclick="updateContact(${results[i].id})">Edit</button>
                            <button onclick="deleteContact(${results[i].id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                }
            }
        };
        xhr.send(jsonPayload);  // This sends the add user request to the database
    }
    catch(err) {
        // TODO: Or only display error if name and email is blank since that is the minimum information needed for each contact
        // By default this just displays a single error message if the add user request is rejected for any reason
        document.getElementById("contactTable").innerHTML = `<tr><td colspan="6">${err.message}</td></tr>`;
    }
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let user_login = document.getElementById("user_login").value;
	let user_password = document.getElementById("user_password").value;
//	var hash = md5( password );
	
	document.getElementById("user_result").innerHTML = "";

	let tmp = {user_login:user_login,user_password:user_password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extention;

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
					document.getElementById("user_result").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				first_name = jsonObject.first_name;
				last_name = jsonObject.last_name;

				saveCookie();
	
				window.location.href = "main.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("user_result").innerHTML = err.message;
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

    console.log(userId);
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogOut()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

