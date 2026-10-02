<?php
// backend/submit_intake.php
header('Content-Type: application/json');

// Allow requests from your frontend (adjust origin if necessary)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Include database connection
require_once 'db_config.php';

// Get JSON body data sent from JavaScript fetch()
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data received']);
    exit;
}

// Basic server-side validation — the client's "required" attribute can be bypassed,
// so re-check here before touching the database.
$fullName = trim($data['fullName'] ?? '');
$workEmail = trim($data['workEmail'] ?? '');
$phoneNum = trim($data['phoneNum'] ?? '');

$errors = [];
if ($fullName === '') {
    $errors[] = 'Full name is required.';
}
if ($workEmail === '' || !filter_var($workEmail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
if ($phoneNum === '' || !preg_match('/^[0-9+\-\s()]{7,20}$/', $phoneNum)) {
    $errors[] = 'A valid phone number is required.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
    exit;
}

try {
    // Prepare SQL insert statement
    $sql = "INSERT INTO contact_submissions (
                full_name, work_email, phone_num
            ) VALUES (
                :full_name, :work_email, :phone_num
            )";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':full_name' => $fullName,
        ':work_email' => $workEmail,
        ':phone_num' => $phoneNum
    ]);

    echo json_encode(['success' => true, 'message' => 'Thanks! We will reach out shortly.']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>