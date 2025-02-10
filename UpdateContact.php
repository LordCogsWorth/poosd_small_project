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
        //They may only try to update a few fields. Make sure we
        //check for empty fields before sending a bad query
        $fieldsToUpdate = [];
        $stmtstmtParams = [];
        $datatypes = "";

        if (!empty($inData["firstName"])) {
            $fieldsToUpdate[] = "first_name = ?";
            $stmtParams[] = $inData["firstName"];
            $datatypes .= "s";
        }
        if (!empty($inData["lastName"])) {
            $fieldsToUpdate[] = "last_name = ?";
            $stmtParams[] = $inData["lastName"];
            $datatypes .= "s";
        }
        if (!empty($inData["email"])) {
            $fieldsToUpdate[] = "contact_email = ?";
            $stmtParams[] = $inData["email"];
            $datatypes .= "s";
        }
        if (!empty($inData["phone"])) {
            $fieldsToUpdate[] = "contact_phone_number = ?";
            $stmtParams[] = $inData["phone"];
            $datatypes .= "s";
        }
        if (!empty($inData["company"])) {
            $fieldsToUpdate[] = "contact_company = ?";
            $stmtParams[] = $inData["company"];
            $datatypes .= "s";
        }

        if (empty($fieldsToUpdate)) {
            returnWithError("No fields provided to update.");
            $conn->close();
            exit();
        }

        // Add contact ID and user ID for WHERE clause
        $stmtParams[] = $inData["id"];
        $stmtParams[] = $inData["userId"];
        $datatypes .= "ii";

        $stmt = $conn->prepare("UPDATE contacts SET " . implode(", ", $fieldsToUpdate) . " WHERE contact_id = ? AND user_id = ?");
        $stmt->bind_param($datatypes, ...$stmtParams);

        if ($stmt->execute()) 
        {
            if ($stmt->affected_rows > 0) 
            {
                returnWithInfo("Contact updated successfully");
            } 
            else 
            {
                returnWithError("No records updated.");
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
