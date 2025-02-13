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
		$stmt = $conn->prepare("INSERT into users (user_login,user_password,user_email,first_name,last_name,user_company,user_phone_number) VALUES(?,?,?,?,?,?,?)");
		$stmt->bind_param("sssssss", $login,$userpassword,$email,$firstName,$lastName,$company,$phone);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		//returnWithError("");
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
