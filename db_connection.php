<?php

$servername = "localhost";
$username = "poosd_database_commander";
$password = "Bubblesort101";
$database = "poosd_contact_manager";

// Create a connection
$conn = new mysqli($servername, $username, $password, $database);

// Check if the connection is successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";

?>