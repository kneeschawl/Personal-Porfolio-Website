<?php
// process.php
header('Content-Type: application/json');

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

// Validate data
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Set your email address where you want to receive messages
$to = "ngyawali72@gmail.com"; // Replace with your email

// Set email subject
$subject = "New Contact Form Message from $name";

// Set email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Set email body
$email_body = "You have received a new message from your website contact form.\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Message:\n$message\n";

// Send email
$mail_sent = mail($to, $subject, $email_body, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again.']);
}
?>