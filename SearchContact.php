<?php
    $inData = getRequestInfo();

    $searchResults = "";
    $searchCount = 0;

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
        // SQL query with proper parentheses for correct logic
        $stmt = $conn->prepare("SELECT first_name, last_name, contact_phone_number, contact_email, contact_company 
                                FROM contacts 
                                WHERE (first_name LIKE ? OR last_name LIKE ? OR contact_email LIKE ? OR contact_phone_number LIKE ? OR contact_company LIKE ?) 
                                AND user_id = ?");
        
        $searchTerm = "%" . $inData["search"] . "%";
        $stmt->bind_param("sssssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userId"]);
        $stmt->execute();
        $result = $stmt->get_result();

        $contacts = [];
        
        while ($row = $result->fetch_assoc())
        {
            $contacts[] = [
                "firstName" => $row["first_name"],
                "lastName" => $row["last_name"],
                "phone" => $row["contact_phone_number"],
                "email" => $row["contact_email"],
                "company" => $row["contact_company"]
            ];
        }

        if (empty($contacts))
        {
            returnWithError("No Records Found");
        }
        else
        {
            returnWithInfo($contacts);
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
        echo json_encode($obj);
    }

    function returnWithError($err)
    {
        $retValue = ["results" => [], "error" => $err];
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($contacts)
    {
        $retValue = ["results" => $contacts, "error" => ""];
        sendResultInfoAsJson($retValue);
    }
?>
