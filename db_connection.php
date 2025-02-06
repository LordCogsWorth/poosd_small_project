<?php

$server = "44.200.18.104";
$username = "poosd_database_commander";
$password = "Bubblesort101";
$database = "poosd_contact_manager";

// Create a connection
$conn = new mysqli($server, $username, $password, $database);

// Check if the connection is successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";

?>