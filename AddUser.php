<?php
    $indata = getRequestInfo();

	// These grab the information by their labels in the json
	$login = $indata["user_login"];
	$userpassword = $indata["user_password"];
	$email = $indata["user_email"];
	$company = $indata["user_company"];
	$phone = $indata["user_phone_number"];
	$firstName = $indata["first_name"];
    $lastName = $indata["last_name"];

	// Database information
	$server = "44.200.18.104";
    $username = "poosd_database_commander";
    $password = "Bubblesort101";
    $database = "poosd_contact_manager";

    $conn = new mysqli($server, $username, $password, $database);
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	} 
	// SQL connection is successful
	else {
		// Check if username is already taken
		$stmt = $conn->prepare("SELECT user_id FROM users WHERE user_login = ?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $stmt->store_result();
		if ($stmt->num_rows > 0) {
            // if it is already taken, give an error
            returnWithError("Username already exists. Please choose another.");
        } else {
			//username is not already taken
			$stmt->close();
			$stmt = $conn->prepare("INSERT into users (user_login,user_password,user_email,first_name,last_name,user_company,user_phone_number) VALUES(?,?,?,?,?,?,?)");
			$stmt->bind_param("sssssss", $login,$userpassword,$email,$firstName,$lastName,$company,$phone);
			if (!$stmt->execute()) {
				returnWithError("Unable to create user.");
			} else {
				returnWithSuccess();
			}

			$stmt->close();
			$conn->close();
		}
	}

    function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err) {
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithSuccess() {
		$retValue = '{"error":""}';
		sendResultInfoAsJson($retValue);
    }
?>