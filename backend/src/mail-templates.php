<?php

declare(strict_types=1);

// Display names of frontend/src/content/hu.ts packages.items.
const PACKAGE_NAMES = ['komfort' => 'CicaKomfort', 'moka' => 'CicaMóka', 'lux' => 'CicaLux'];

const MAIL_FOOTER = 'CicaŐr – cicaszittelés Budapesten';

/** Escapes a value for HTML text and attributes. Every user value in a template must go through this. */
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/**
 * The template name lives in an unusual variable name: extract() skips variables that already exist,
 * so a template variable called $name would otherwise be silently shadowed.
 *
 * @param array<string, mixed> $vars
 */
function renderTemplate(string $__template, array $vars): string
{
    extract($vars, EXTR_SKIP);
    ob_start();
    try {
        require __DIR__ . "/../templates/{$__template}.php";
        return (string) ob_get_contents();
    } finally {
        ob_end_clean();
    }
}

/**
 * @param array<string, mixed> $data validated contact data
 * @return array<string, string>
 */
function bookingRows(array $data): array
{
    return [
        'Csomag' => PACKAGE_NAMES[$data['packageId']] ?? 'Nincs megadva',
        'Időtartam' => "{$data['duration']} perc",
    ];
}

/** @param array<string, string> $rows */
function textRows(array $rows): string
{
    return implode("\n", array_map(fn ($label, $value) => "{$label}: {$value}", array_keys($rows), $rows));
}

/**
 * @param array<string, mixed> $data validated contact data
 * @return array{subject: string, html: string, text: string}
 */
function buildOwnerMail(array $data): array
{
    $title = 'Új üzenet a weboldalról';
    $rows = [
        'Név' => $data['name'],
        'E-mail' => $data['email'],
        'Telefon' => $data['phone'] !== '' ? $data['phone'] : '-',
        ...bookingRows($data),
    ];

    return [
        'subject' => "{$title} – {$data['name']}",
        'html' => renderTemplate('layout', [
            'title' => $title,
            'preheader' => "{$data['name']} írt neked.",
            'footer' => MAIL_FOOTER,
            'content' => renderTemplate('owner-notification', [
                'rows' => $rows,
                'message' => $data['message'],
                'email' => $data['email'],
            ]),
        ]),
        'text' => textRows($rows) . "\n\n{$data['message']}",
    ];
}

/**
 * @param array<string, mixed> $data validated contact data
 * @return array{subject: string, html: string, text: string}
 */
function buildVisitorConfirmation(array $data): array
{
    $title = 'Megkaptam az üzeneted';
    $rows = bookingRows($data);
    $footer = 'Ezt a levelet azért kaptad, mert kitöltötted a kapcsolatfelvételi űrlapot a CicaŐr weboldalán. '
        . 'Ha nem te voltál, nyugodtan hagyd figyelmen kívül.';

    return [
        'subject' => "{$title} – CicaŐr",
        'html' => renderTemplate('layout', [
            'title' => $title,
            'preheader' => 'Köszönöm, hogy írtál! Hamarosan válaszolok.',
            'footer' => $footer,
            'content' => renderTemplate('visitor-confirmation', ['name' => $data['name'], 'rows' => $rows]),
        ]),
        'text' => implode("\n\n", [
            "Kedves {$data['name']}!",
            'Köszönöm, hogy írtál! Megkaptam az üzenetedet, és hamarosan válaszolok.',
            textRows($rows),
            'Ha valamit kiegészítenél, egyszerűen válaszolj erre a levélre.',
            "Üdvözlettel:\nCicaŐr",
            "--\n{$footer}",
        ]),
    ];
}
