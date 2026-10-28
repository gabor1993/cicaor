<?php

declare(strict_types=1);

const PACKAGE_IDS = ['', 'komfort', 'moka', 'lux'];
const DURATIONS = ['30', '60', '90'];

/**
 * Mirrors the Zod schema in frontend/src/features/contact/schema.ts. The browser check is only for UX,
 * this one is the real gate.
 *
 * @return array{0: array<string, mixed>, 1: array<string, string>} [clean data, errors by field]
 */
function validateContact(array $input): array
{
    $errors = [];

    $name = trim((string) ($input['name'] ?? ''));
    if ($name === '' || mb_strlen($name) > 100) {
        $errors['name'] = 'invalid';
    }

    $email = trim((string) ($input['email'] ?? ''));
    if (mb_strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $errors['email'] = 'invalid';
    }

    $phone = trim((string) ($input['phone'] ?? ''));
    if (mb_strlen($phone) > 30) {
        $errors['phone'] = 'invalid';
    }

    $packageId = (string) ($input['packageId'] ?? '');
    if (!in_array($packageId, PACKAGE_IDS, true)) {
        $errors['packageId'] = 'invalid';
    }

    $duration = (string) ($input['duration'] ?? '');
    if (!in_array($duration, DURATIONS, true)) {
        $errors['duration'] = 'invalid';
    }

    $message = trim((string) ($input['message'] ?? ''));
    if ($message === '' || mb_strlen($message) > 2000) {
        $errors['message'] = 'invalid';
    }

    if (($input['consent'] ?? false) !== true) {
        $errors['consent'] = 'required';
    }

    $data = compact('name', 'email', 'phone', 'packageId', 'duration', 'message');

    return [$data, $errors];
}
