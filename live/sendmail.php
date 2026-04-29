<?php
/**
 * StartGOLD Contact Form Handler
 * - Validates math CAPTCHA
 * - Sends enquiry email via SMTP (PHPMailer)
 * - Returns JSON response for AJAX calls
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// PHPMailer
require_once __DIR__ . '/vendor/PHPMailer/Exception.php';
require_once __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/vendor/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// ===== CONFIGURATION =====
$SMTP_HOST     = 'smtp.gmail.com';
$SMTP_PORT     = 465;
$SMTP_USER     = 'noreply@logimax.co.in';
$SMTP_PASS     = 'ykdm rxdw wcnj gcjl';
$RECIPIENT     = 'karthik@logimax.co.in';
$FROM_NAME     = 'StartGOLD Enquiry';

// ===== ONLY POST =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ===== READ INPUT =====
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!$data) {
    $data = $_POST;
}

// ===== CAPTCHA VALIDATION =====
$captchaAnswer = isset($data['captchaAnswer']) ? trim($data['captchaAnswer']) : '';
$captchaExpected = isset($data['captchaExpected']) ? trim($data['captchaExpected']) : '';

if ($captchaAnswer === '' || $captchaExpected === '' || $captchaAnswer !== $captchaExpected) {
    echo json_encode(['success' => false, 'message' => 'Invalid CAPTCHA. Please try again.']);
    exit;
}

// ===== EXTRACT FIELDS =====
$firstName = htmlspecialchars(trim($data['firstName'] ?? ''));
$lastName  = htmlspecialchars(trim($data['lastName'] ?? ''));
$phone     = htmlspecialchars(trim($data['phone'] ?? ''));
$phoneCode = htmlspecialchars(trim($data['phoneCode'] ?? ''));
$email     = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$country   = htmlspecialchars(trim($data['country'] ?? ''));
$state     = htmlspecialchars(trim($data['state'] ?? ''));
$city      = htmlspecialchars(trim($data['city'] ?? ''));
$town      = htmlspecialchars(trim($data['town'] ?? ''));
$pincode   = htmlspecialchars(trim($data['pincode'] ?? ''));
$address   = htmlspecialchars(trim($data['address'] ?? ''));
$message   = htmlspecialchars(trim($data['message'] ?? ''));

// ===== SERVER-SIDE VALIDATION (no empty fields) =====
$errors = [];
if (strlen($firstName) < 2) $errors[] = 'First name is required (min 2 chars)';
if (strlen($lastName) < 2)  $errors[] = 'Last name is required (min 2 chars)';
if (empty($phone))          $errors[] = 'Phone number is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if (empty($country))        $errors[] = 'Country is required';
if (empty($state))          $errors[] = 'State is required';
if (empty($city))           $errors[] = 'City is required';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// ===== BUILD EMAIL BODY =====
$fullPhone = $phoneCode ? "(+{$phoneCode}) {$phone}" : $phone;

$emailBody = "
<html>
<body style='font-family: Arial, sans-serif; line-height: 1.8; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;'>
        <div style='background: linear-gradient(135deg, #003716, #167525); padding: 24px 30px;'>
            <h2 style='color: #ffd700; margin: 0; font-size: 22px;'>New StartGOLD Enquiry</h2>
        </div>
        <div style='padding: 28px 30px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr style='border-bottom: 1px solid #f0f0f0;'>
                    <td style='padding: 10px 0; font-weight: 700; color: #003716; width: 140px;'>Name</td>
                    <td style='padding: 10px 0;'>{$firstName} {$lastName}</td>
                </tr>
                <tr style='border-bottom: 1px solid #f0f0f0;'>
                    <td style='padding: 10px 0; font-weight: 700; color: #003716;'>Phone</td>
                    <td style='padding: 10px 0;'>{$fullPhone}</td>
                </tr>
                <tr style='border-bottom: 1px solid #f0f0f0;'>
                    <td style='padding: 10px 0; font-weight: 700; color: #003716;'>Email</td>
                    <td style='padding: 10px 0;'><a href='mailto:{$email}'>{$email}</a></td>
                </tr>
                <tr style='border-bottom: 1px solid #f0f0f0;'>
                    <td style='padding: 10px 0; font-weight: 700; color: #003716;'>Location</td>
                    <td style='padding: 10px 0;'>{$town}, {$city}, {$state}, {$country}" . ($pincode ? " - {$pincode}" : "") . "</td>
                </tr>
                " . ($address ? "
                <tr style='border-bottom: 1px solid #f0f0f0;'>
                    <td style='padding: 10px 0; font-weight: 700; color: #003716; vertical-align: top;'>Address</td>
                    <td style='padding: 10px 0;'>{$address}</td>
                </tr>" : "") . "
                " . ($message ? "
                <tr>
                    <td style='padding: 10px 0; font-weight: 700; color: #003716; vertical-align: top;'>Message</td>
                    <td style='padding: 10px 0;'>{$message}</td>
                </tr>" : "") . "
            </table>
        </div>
        <div style='background: #f8f8f8; padding: 14px 30px; font-size: 12px; color: #999; text-align: center;'>
            Sent from StartGOLD Contact Form
        </div>
    </div>
</body>
</html>";

// ===== SEND VIA PHPMAILER SMTP =====
$mail = new PHPMailer(true);

try {
    // SMTP config
    $mail->isSMTP();
    $mail->Host       = $SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = $SMTP_USER;
    $mail->Password   = $SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $SMTP_PORT;
    
    // Disable SSL certificate verification for local dev
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    // Sender & recipient
    $mail->setFrom($SMTP_USER, $FROM_NAME);
    $mail->addAddress($RECIPIENT);
    $mail->addReplyTo($email, "{$firstName} {$lastName}");

    // Content
    $mail->isHTML(true);
    $mail->Subject = "StartGOLD Enquiry - {$firstName} {$lastName}";
    $mail->Body    = $emailBody;
    $mail->AltBody = "New enquiry from {$firstName} {$lastName} ({$email}). Phone: {$fullPhone}. Location: {$town}, {$city}, {$state}, {$country}. Address: {$address}. Message: {$message}";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Thank you! Your enquiry has been sent successfully.']);

} catch (Exception $e) {
    // Log error for debugging
    error_log("StartGOLD Mail Error: " . $mail->ErrorInfo);
    
    // Try fallback: port 587 with STARTTLS
    try {
        $mail2 = new PHPMailer(true);
        $mail2->isSMTP();
        $mail2->Host       = $SMTP_HOST;
        $mail2->SMTPAuth   = true;
        $mail2->Username   = $SMTP_USER;
        $mail2->Password   = $SMTP_PASS;
        $mail2->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail2->Port       = 587;
        
        $mail2->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        $mail2->setFrom($SMTP_USER, $FROM_NAME);
        $mail2->addAddress($RECIPIENT);
        $mail2->addReplyTo($email, "{$firstName} {$lastName}");
        $mail2->isHTML(true);
        $mail2->Subject = "StartGOLD Enquiry - {$firstName} {$lastName}";
        $mail2->Body    = $emailBody;
        $mail2->AltBody = "New enquiry from {$firstName} {$lastName} ({$email}). Phone: {$fullPhone}. Location: {$town}, {$city}, {$state}, {$country}. Address: {$address}. Message: {$message}";

        $mail2->send();
        echo json_encode(['success' => true, 'message' => 'Thank you! Your enquiry has been sent successfully.']);

    } catch (Exception $e2) {
        error_log("StartGOLD Mail Fallback Error: " . $mail2->ErrorInfo);
        echo json_encode([
            'success' => false, 
            'message' => 'Failed to send email. Please try again later.',
            'debug' => $mail->ErrorInfo . ' | Fallback: ' . $mail2->ErrorInfo
        ]);
    }
}
?>
