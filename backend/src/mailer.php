<?php

declare(strict_types=1);

/** Removes line breaks so user input can never inject extra mail headers. */
function stripLineBreaks(string $value): string
{
    return str_replace(["\r", "\n", "%0a", "%0d"], ' ', $value);
}

/** @param array<string, mixed> $data validated contact data */
function sendContactMail(array $data): void
{
    $to = env('MAIL_TO');
    $from = env('MAIL_FROM');
    if ($to === '' || $from === '') {
        throw new RuntimeException('MAIL_TO or MAIL_FROM is not configured.');
    }

    $subject = '=?UTF-8?B?' . base64_encode('Új üzenet a weboldalról – ' . stripLineBreaks($data['name'])) . '?=';
    $body = implode("\n", [
        "Név: {$data['name']}",
        "E-mail: {$data['email']}",
        'Telefon: ' . ($data['phone'] !== '' ? $data['phone'] : '-'),
        'Csomag: ' . ($data['packageId'] !== '' ? $data['packageId'] : '-'),
        "Időtartam: {$data['duration']} perc",
        '',
        $data['message'],
    ]);

    // Local development: write the mail to a log file instead of sending it.
    if (env('MAIL_DRIVER', 'mail') === 'log') {
        $dir = __DIR__ . '/../storage';
        file_put_contents($dir . '/mail.log', "To: {$to}\nSubject: {$subject}\n\n{$body}\n\n---\n", FILE_APPEND | LOCK_EX);
        return;
    }

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . stripLineBreaks($from),
        // The email address was validated, so it is safe to use as Reply-To.
        'Reply-To: ' . stripLineBreaks($data['email']),
    ];

    if (!mail($to, $subject, $body, implode("\r\n", $headers))) {
        throw new RuntimeException('mail() returned false.');
    }
}
