<?php
    $indata = getRequestInfo();

    // First name, last name, email, and phone are required
    if (empty($indata["first_name"]) || empty($indata["last_name"]) || empty($indata["contact_email"]) || empty($indata["contact_phone_number"])) {
        returnWithError("First name, last name, email, and phone are required.");
        exit();
    }

    $firstName = $indata["first_name"];
    $lastName = $indata["last_name"];
    $contactEmail = $indata["contact_email"];
    $contactPhone = $indata["contact_phone_number"];
    $contactCompany = $indata["contact_company"];
    $notes = $indata["notes"];
    $userId = $indata["user_id"];   // This is the ID of the user that is logged in, not the contact.

    $server = "44.200.18.104";
    $username = "poosd_database_commander";
    $password = "Bubblesort101";
    $database = "poosd_contact_manager";

    $conn = new mysqli($server, $username, $password, $database);

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
        exit();
    }

    // Check if phone or email already exist
    $stmt = $conn->prepare("SELECT contact_id FROM contacts WHERE user_id = ? AND (contact_email = ? OR contact_phone_number = ?)");
    $stmt->bind_param("iss", $userId, $contactEmail, $contactPhone);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->close();
        $conn->close();
        returnWithError("A contact with this email or phone already exists.");
        exit();
    } 

    // Insert new contact
    $stmt->close();
    $stmt = $conn->prepare("INSERT INTO contacts (first_name, last_name, contact_email, contact_phone_number, contact_company, notes, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssi", $firstName, $lastName, $contactEmail, $contactPhone, $contactCompany, $notes, $userId);

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        returnWithSuccess("Contact added successfully!");
        exit();
    } else {
        $stmt->close();
        $conn->close();
        returnWithError("Unable to add contact.");
        exit();
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

    function returnWithSuccess($message) {
        $retValue = '{"message":"' . $message . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
