<?php
    $indata = getRequestInfo();

    $firstName = $indata["first_name"];
    $lastName = $indata["last_name"];
    $contactEmail = $indata["contact_email"];
    $contactPhone = $indata["contact_phone_number"];
    $contactCompany = $indata["contact_company"];
    $notes = $indata["notes"];
    $userId = $indata["user_id"];   // This is the id of the user that is logged in not the contact

    $server = "44.200.18.104";
    $username = "poosd_database_commander";
    $password = "Bubblesort101";
    $database = "poosd_contact_manager";

    $conn = new mysqli($server, $username, $password, $database);

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    }
    else {
        $stmt = $conn->prepare("INSERT into contacts (first_name,last_name,contact_email,contact_phone_number,contact_company,notes,user_id) VALUES(?,?,?,?,?,?,?)");
        $stmt->bind_param("ssssssi", $firstName,$lastName,$contactEmail,$contactPhone,$contactCompany,$notes,$userId);
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
