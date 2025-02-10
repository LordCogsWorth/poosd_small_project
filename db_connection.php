<?php

$server = "44.200.18.104";
$username = "poosd_database_commander";
$password = "Bubblesort101";
$database = "poosd_contact_manager";

$conn = new mysqli($server, $username, $password, $database);

// Check if the connection is successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully<br><br>";

// Query to select all data from the contacts table
$sql = "SELECT * FROM contacts";
$result = $conn->query($sql);

// Check if there are results
if ($result->num_rows > 0) {

    echo "<h2>Contacts Table</h2>";
    echo "<table border='1'>";
    echo "<tr><th>Contact ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Notes</th><th>User ID</th><th>Date Created</th></tr>";

    while ($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>{$row['contact_id']}</td>
                <td>{$row['first_name']}</td>
                <td>{$row['last_name']}</td>
                <td>{$row['contact_email']}</td>
                <td>{$row['contact_phone_number']}</td>
                <td>{$row['contact_company']}</td>
                <td>{$row['notes']}</td>
                <td>{$row['user_id']}</td>
                <td>{$row['date_created']}</td>
              </tr>";
    }
    echo "</table><br>";
} else {
    echo "<h2>Contacts Table</h2>No records found.<br><br>";
}

$user_sql = "SELECT * FROM users";
$user_result = $conn->query($user_sql);


if ($user_result->num_rows > 0) {
    echo "<h2>Users Table</h2>";
    echo "<table border='1'>";
    echo "<tr><th>User ID</th><th>Login</th><th>Password</th><th>Email</th><th>First Name</th><th>Last Name</th><th>Birth Date</th><th>Company</th><th>Phone Number</th></tr>";

    while ($row = $user_result->fetch_assoc()) {
        echo "<tr>
                <td>{$row['user_id']}</td>
                <td>{$row['user_login']}</td>
                <td>{$row['user_password']}</td>
                <td>{$row['user_email']}</td>
                <td>{$row['first_name']}</td>
                <td>{$row['last_name']}</td>
                <td>{$row['birth_date']}</td>
                <td>{$row['user_company']}</td>
                <td>{$row['user_phone_number']}</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "<h2>Users Table</h2>No records found.";
}

// Close the connection
$conn->close();

?>