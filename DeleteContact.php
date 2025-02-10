<?php

    $indata = getRequestInfo();

    $conn = new mysqli("localhost", "poosd_database_commander", "Bubblesort101", "poosd_contact_manager");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    }
    else {
        $stmt = $conn->prepare("DELETE from contacts WHERE contact_id=?");
        $stmt->bind_param("i", $indata["contact_id"]);
        if ($stmt->execute()) {
            returnWithInfo("Contact deleted successfully");
        }
        else {
            returnWithError("Deletion unsuccessful");
        }
        $stmt->close();
        $conn->close();
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