<?php
    $indata = getRequestInfo();

    $contactId = $indata["contact_id"];
    $firstName = $indata["first_name"];
    $lastName = $indata["last_name"];
    $contactEmail = $indata["contact_email"];
    $contactPhone = $indata["contact_phone_number"];
    $contactCompany = $indata["contact_company"];
    $notes = $indata["notes"];
    $userId = $indata["user_id"];   // This is the id of the user that is logged in not the contact

    $conn = new mysqli("localhost", "poosd_database_commander", "Bubblesort101", "poosd_contact_manager");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    }
   `else {
        $stmt = $conn->prepare("INSERT into contacts (contact_id,first_name,last_name,contact_email,contact_phone_number,contact_company,notes,user_id) VALUES(?,?,?,?,?,?,?,?)");
        $stmt->bind_param("ssssssss", $contactId, $firstName,$lastName,$contactEmail,$contactPhone,$contactCompany,$notes,$userId);
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
