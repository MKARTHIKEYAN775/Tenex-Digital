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

try {
    // Prepare SQL insert statement
    $sql = "INSERT INTO contact_submissions (
                full_name, work_email, phone_num, company_name, website_url, 
                industry_sector, monthly_revenue, business_model, team_size, 
                services_needed, monthly_ad_spend, timeframe, primary_bottleneck, success_vision
            ) VALUES (
                :full_name, :work_email, :phone_num, :company_name, :website_url, 
                :industry_sector, :monthly_revenue, :business_model, :team_size, 
                :services_needed, :monthly_ad_spend, :timeframe, :primary_bottleneck, :success_vision
            )";

    $stmt = $pdo->prepare($sql);

    // Format services array safely for PostgreSQL text[] type
    $services = isset($data['servicesNeeded']) && is_array($data['servicesNeeded']) 
                ? '{' . implode(',', array_map(fn($s) => '"' . str_replace('"', '\"', $s) . '"', $data['servicesNeeded'])) . '}' 
                : '{}';

    $stmt->execute([
        ':full_name' => $data['fullName'] ?? '',
        ':work_email' => $data['workEmail'] ?? '',
        ':phone_num' => $data['phoneNum'] ?? '',
        ':company_name' => $data['companyName'] ?? '',
        ':website_url' => $data['websiteUrl'] ?? null,
        ':industry_sector' => $data['industrySector'] ?? '',
        ':monthly_revenue' => $data['monthlyRevenue'] ?? '',
        ':business_model' => $data['businessModel'] ?? '',
        ':team_size' => $data['teamSize'] ?? '',
        ':services_needed' => $services,
        ':monthly_ad_spend' => $data['monthlyAdSpend'] ?? '',
        ':timeframe' => $data['timeframe'] ?? '',
        ':primary_bottleneck' => $data['primaryBottleneck'] ?? '',
        ':success_vision' => $data['successVision'] ?? ''
    ]);

    echo json_encode(['success' => true, 'message' => 'Intake profile stored successfully in database']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>