<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/mail-templates.php';

/** Removes line breaks so user input can never inject extra mail headers. */
function stripLineBreaks(string $value): string
{
    return str_replace(["\r", "\n", "%0a", "%0d"], ' ', $value);
}

/** @param array<string, mixed> $data validated contact data */
function sendContactMail(array $data): void
{
    $to = env('MAIL_TO');
    // The email address was validated, so it is safe to use as Reply-To.
    deliver('owner-notification', buildOwnerMail($data), $to, $data['email']);
}

/** @param array<string, mixed> $data validated contact data */
function sendVisitorConfirmation(array $data): void
{
    deliver('visitor-confirmation', buildVisitorConfirmation($data), $data['email'], env('MAIL_TO'));
}

/** @param array{subject: string, html: string, text: string} $mail */
function deliver(string $kind, array $mail, string $to, string $replyTo): void
{
    $from = env('MAIL_FROM');
    if ($to === '' || $from === '') {
        throw new RuntimeException('MAIL_TO or MAIL_FROM is not configured.');
    }
    $subject = stripLineBreaks($mail['subject']);

    // Local development: keep the mail on disk instead of sending it. The HTML can be opened in a browser.
    if (env('MAIL_DRIVER', 'smtp') === 'log') {
        $dir = __DIR__ . '/../storage';
        file_put_contents("{$dir}/mail.log", "To: {$to}\nSubject: {$subject}\n\n{$mail['text']}\n\n---\n", FILE_APPEND | LOCK_EX);
        file_put_contents("{$dir}/{$kind}.html", $mail['html'], LOCK_EX);
        return;
    }

    $mailer = new PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = env('SMTP_HOST');
    $mailer->Port = (int) env('SMTP_PORT', '587');
    $mailer->SMTPAuth = true;
    $mailer->Username = env('SMTP_USERNAME');
    $mailer->Password = env('SMTP_PASSWORD');
    // 587 uses STARTTLS, 465 uses implicit TLS ("ssl").
    $mailer->SMTPSecure = env('SMTP_ENCRYPTION', 'tls') === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->Timeout = 15;
    $mailer->CharSet = PHPMailer::CHARSET_UTF8;

    $mailer->setFrom($from, env('MAIL_FROM_NAME', 'CicaŐr'));
    $mailer->addAddress($to);
    $mailer->addReplyTo($replyTo);
    $mailer->isHTML();
    $mailer->Subject = $subject;
    $mailer->Body = $mail['html'];
    $mailer->AltBody = $mail['text'];
    $mailer->send();
}
