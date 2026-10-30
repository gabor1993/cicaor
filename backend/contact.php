<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/src/env.php';
require __DIR__ . '/src/validation.php';
require __DIR__ . '/src/rate-limit.php';
require __DIR__ . '/src/mailer.php';

const MAX_BODY_BYTES = 10_000;

function respond(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

loadEnv(__DIR__ . '/.env');

// CORS: the Next.js site is served from another origin, so only allow the configured ones.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = array_filter(array_map('trim', explode(',', env('ALLOWED_ORIGINS', ''))));
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

header('X-Content-Type-Options: nosniff');

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['error' => 'method_not_allowed']);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['error' => 'payload_too_large']);
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
    respond(400, ['error' => 'invalid_json']);
}

// Honeypot: pretend success so bots get no signal that they were detected.
if (($payload['website'] ?? '') !== '') {
    respond(200, ['ok' => true]);
}

[$data, $errors] = validateContact($payload);
if ($errors !== []) {
    respond(422, ['error' => 'validation_failed', 'fields' => $errors]);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!allowRequest($ip, (int) env('RATE_LIMIT_MAX', '5'), (int) env('RATE_LIMIT_WINDOW_SECONDS', '3600'))) {
    header('Retry-After: 3600');
    respond(429, ['error' => 'rate_limited']);
}

try {
    sendContactMail($data);
} catch (Throwable $exception) {
    // Technical details go to the server log only, never to the visitor.
    error_log('Contact mail failed: ' . $exception->getMessage());
    respond(500, ['error' => 'send_failed']);
}

// The enquiry has already arrived, so a failed confirmation must not turn into an error for the visitor.
try {
    sendVisitorConfirmation($data);
} catch (Throwable $exception) {
    error_log('Visitor confirmation failed: ' . $exception->getMessage());
}

respond(200, ['ok' => true]);
