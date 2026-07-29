<?php
// backend/db_config.php

// Database configuration (Change these when deploying to Hostinger)
$host = 'localhost';
$port = '5432';
$dbname = 'phptest'; // Replace with your local Postgres database name
$user = 'postgres';      // Replace with your local Postgres username
$password = 'root'; // Replace with your local Postgres password

try {
    // Create a PDO connection to PostgreSQL
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    // Return a JSON error if connection fails
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
?>