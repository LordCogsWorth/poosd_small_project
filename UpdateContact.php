<?php
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "Admin", "AdminPass", "SmallProj");

    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contact SET Name=?, Email=?, Phone=?, Address=? WHERE ID=? AND UserID=?");
        $stmt->bind_param("ssssii", $inData["name"], $inData["email"], $inData["phone"], $inData["address"], $inData["id"], $inData["userId"]);

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
