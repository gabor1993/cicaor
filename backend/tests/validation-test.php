<?php

declare(strict_types=1);

// Dependency-free test runner: `php tests/validation-test.php` (exit code 1 on failure).
require __DIR__ . '/../src/validation.php';

$failures = 0;

function check(string $label, bool $condition): void
{
    global $failures;
    echo ($condition ? 'PASS' : 'FAIL') . " - {$label}\n";
    if (!$condition) {
        $failures++;
    }
}

$valid = [
    'name' => 'Teszt Elek',
    'email' => 'teszt@example.com',
    'phone' => '',
    'packageId' => 'moka',
    'duration' => '60',
    'message' => 'Szia!',
    'consent' => true,
];

[, $errors] = validateContact($valid);
check('valid input has no errors', $errors === []);

[, $errors] = validateContact([...$valid, 'email' => 'not-an-email']);
check('invalid email is rejected', isset($errors['email']));

[, $errors] = validateContact([...$valid, 'name' => '   ']);
check('blank name is rejected', isset($errors['name']));

[, $errors] = validateContact([...$valid, 'message' => str_repeat('a', 2001)]);
check('too long message is rejected', isset($errors['message']));

[, $errors] = validateContact([...$valid, 'packageId' => 'hacker']);
check('unknown package is rejected', isset($errors['packageId']));

[, $errors] = validateContact([...$valid, 'duration' => '45']);
check('unknown duration is rejected', isset($errors['duration']));

[, $errors] = validateContact([...$valid, 'consent' => 'true']);
check('consent must be a real boolean true', isset($errors['consent']));

[$data] = validateContact([...$valid, 'name' => "  Elek\n"]);
check('name is trimmed', $data['name'] === 'Elek');

exit($failures === 0 ? 0 : 1);
