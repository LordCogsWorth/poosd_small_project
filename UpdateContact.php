<?php
    $inData = getRequestInfo();

     // Temporary stuff to connect
    $server = "44.200.18.104";
    $username = "poosd_database_commander";
    $password = "Bubblesort101";
    $database = "poosd_contact_manager";

    $conn = new mysqli($server, $username, $password, $database);

    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("UPDATE contacts SET first_name=?, last_name=?, contact_email=?, contact_phone_number=?, contact_company=? WHERE contact_id=? AND user_id=?");
        $stmt->bind_param("sssssii", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"], $inData["company"], $inData["id"], $inData["userId"]);

        if ($stmt->execute()) 
        {
            if ($stmt->affected_rows > 0) 
            {
                returnWithInfo("Contact updated successfully");
            } 
            else 
            {
                returnWithError("No records updated. Check if the contact ID and UserID are correct.");
            }
        } 
        else 
        {
            returnWithError("Update failed");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($message)
    {
        $retValue = '{"success":"' . $message . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
