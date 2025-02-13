<?php
  $indata = getRequestInfo();

	// These grab the information by their labels in the json
	// TODO: Not sure what they would be named in the json so I just used their names from the database as a placeholder
  $userId = $indata["user_id"];
	$login = $indata["user_login"];
	$password = $indata["user_password"];
	$email = $indata["user_email"];
	$company = $indata["user_company"];
	$phone = $indata["user_phone_number"];
	$firstName = $indata["first_name"];
  $lastName = $indata["last_name"];
	//$bday = $indata["birth_date"];

  $conn = new mysqli("localhost", "poosd_database_commander", "Bubblesort101", "poosd_contact_manager");
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	} 
	// SQL connection is successful
	else {
		$stmt = $conn->prepare("INSERT into Users (user_id,user_login,user_password,user_email,first_name,last_name,user_company,user_phone_number) VALUES(?,?,?,?,?,?,?,?)");
		$stmt->bind_param("ssssssss", $userId,$login,$password,$email,$firstName,$lastName,$company,$phone);
		$stmt->execute();  // Sends the sql statement to the database
		$stmt->close();
		$conn->close();
		returnWithError("");
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
?>
