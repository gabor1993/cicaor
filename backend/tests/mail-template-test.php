<?php

declare(strict_types=1);

// Dependency-free test runner: `php tests/mail-template-test.php` (exit code 1 on failure).
require __DIR__ . '/../src/mail-templates.php';

$failures = 0;

function check(string $label, bool $condition): void
{
    global $failures;
    echo ($condition ? 'PASS' : 'FAIL') . " - {$label}\n";
    if (!$condition) {
        $failures++;
    }
}

$data = [
    'name' => 'Teszt <script>alert(1)</script> Elek',
    'email' => 'teszt@example.com',
    'phone' => '+36 30 123 4567',
    'packageId' => 'moka',
    'duration' => '60',
    'message' => "Első sor <b>vastag</b>\nMásodik sor",
];

$owner = buildOwnerMail($data);
check('owner mail escapes the name', !str_contains($owner['html'], '<script>') && str_contains($owner['html'], '&lt;script&gt;'));
check('owner mail escapes the message', !str_contains($owner['html'], '<b>vastag</b>'));
check('owner mail keeps message line breaks', str_contains($owner['html'], 'Első sor &lt;b&gt;vastag&lt;/b&gt;<br />'));
check('owner mail lists every field', array_reduce(
    ['teszt@example.com', '+36 30 123 4567', 'CicaMóka', '60 perc', 'mailto:teszt@example.com'],
    fn (bool $all, string $part) => $all && str_contains($owner['html'], $part),
    true,
));
check('owner text version carries the message unchanged', str_contains($owner['text'], "Első sor <b>vastag</b>\nMásodik sor"));
check('owner subject names the sender', str_contains($owner['subject'], 'Teszt'));

$visitor = buildVisitorConfirmation($data);
check('confirmation leaves the message out', !str_contains($visitor['html'], 'Első sor') && !str_contains($visitor['text'], 'Első sor'));
check('confirmation escapes the name', !str_contains($visitor['html'], '<script>'));
check('confirmation greets the visitor by name', str_contains($visitor['html'], 'Kedves Teszt &lt;script&gt;'));
check('confirmation shows the booking', str_contains($visitor['html'], 'CicaMóka') && str_contains($visitor['text'], 'Időtartam: 60 perc'));

$withoutPackage = buildVisitorConfirmation([...$data, 'packageId' => '']);
check('missing package is shown as not given', str_contains($withoutPackage['text'], 'Csomag: Nincs megadva'));

$withoutPhone = buildOwnerMail([...$data, 'phone' => '']);
check('missing phone is shown as a dash', str_contains($withoutPhone['text'], 'Telefon: -'));

exit($failures === 0 ? 0 : 1);
