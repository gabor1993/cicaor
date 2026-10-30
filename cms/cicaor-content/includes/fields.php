<?php

declare(strict_types=1);

/*
 * The single description of everything editable. The admin forms, the saving and the REST output are all driven
 * by these lists, so a new field only has to be added here (and to frontend/src/content/site-content-schema.ts).
 *
 * Field types: text, textarea, lines (one item per line), number, checkbox, select, image (attachment ID).
 */

/** @return array<string, array<string, mixed>> post type => config */
function cicaor_collections(): array
{
    $imageFields = [
        'image' => ['type' => 'image', 'label' => 'Kép'],
        'image_alt' => ['type' => 'text', 'label' => 'A kép rövid leírása (alt szöveg, a látássérült látogatóknak)'],
    ];

    return [
        'cicaor_package' => [
            'menu' => 'Csomagok',
            'singular' => 'Csomag',
            'title' => 'Csomag neve (pl. CicaKomfort)',
            // Package ids are wired into the contact form and its validation, so packages can be edited but not added.
            'fixed' => true,
            'fields' => [
                'label' => ['type' => 'text', 'label' => 'Felirat a név felett (pl. Alapcsomag)'],
                'tagline' => ['type' => 'text', 'label' => 'Rövid szlogen'],
                'visit_base' => ['type' => 'number', 'label' => 'Látogatás ára 30 percre (Ft)'],
                'visit_step' => ['type' => 'number', 'label' => 'Felár minden további 30 percre (Ft)'],
                'multi_base' => ['type' => 'number', 'label' => 'Napi ár 3 napnál hosszabb távollétre, 30 perc (Ft)'],
                'multi_step' => ['type' => 'number', 'label' => 'Többnapos felár minden további 30 percre (Ft)'],
                'features' => ['type' => 'lines', 'label' => 'Mit tartalmaz? (soronként egy tétel)'],
                'popular' => ['type' => 'checkbox', 'label' => '„Népszerű” jelvény és kiemelés'],
                ...$imageFields,
            ],
            'help' => 'A foglalható időtartamokat (pl. CicaLux: 60/90 perc) a kód tartalmazza, mert az űrlap ellenőrzése is erre épül.',
        ],
        'cicaor_addon' => [
            'menu' => 'Felárak',
            'singular' => 'Felár',
            'title' => 'Felár neve (pl. További cica)',
            'fields' => [
                'icon' => ['type' => 'select', 'label' => 'Ikon', 'options' => [
                    'cat' => 'Cica', 'calendar' => 'Naptár', 'map-pin' => 'Helyszín', 'zap' => 'Villám', 'repeat' => 'Ismétlés', 'key' => 'Kulcs',
                ]],
                'price' => ['type' => 'text', 'label' => 'Ár (pl. +1 000 Ft)'],
                'unit' => ['type' => 'text', 'label' => 'Egység (pl. / látogatás)'],
                'note' => ['type' => 'text', 'label' => 'Magyarázat'],
            ],
        ],
        'cicaor_feature' => [
            'menu' => 'Előnyök sáv',
            'singular' => 'Előny',
            'title' => 'Cím',
            'fields' => [
                'icon' => ['type' => 'select', 'label' => 'Ikon', 'options' => [
                    'heart' => 'Szív', 'shield' => 'Pajzs', 'paw' => 'Mancs', 'house' => 'Ház',
                ]],
                'body' => ['type' => 'text', 'label' => 'Rövid szöveg'],
            ],
        ],
        'cicaor_service' => [
            'menu' => 'Szolgáltatások',
            'singular' => 'Szolgáltatás',
            'title' => 'Cím',
            'fields' => [
                'icon' => ['type' => 'select', 'label' => 'Ikon', 'options' => [
                    'house' => 'Ház', 'cats' => 'Cicák', 'calendar' => 'Naptár',
                ]],
                'body' => ['type' => 'textarea', 'label' => 'Leírás'],
                ...$imageFields,
            ],
        ],
        'cicaor_review' => [
            'menu' => 'Vélemények',
            'singular' => 'Vélemény',
            'title' => 'A gazdi neve',
            'fields' => [
                'quote' => ['type' => 'textarea', 'label' => 'Vélemény'],
            ],
        ],
        'cicaor_faq' => [
            'menu' => 'GYIK',
            'singular' => 'Kérdés',
            'title' => 'Kérdés',
            'fields' => [
                'answer' => ['type' => 'textarea', 'label' => 'Válasz'],
                'more' => ['type' => 'checkbox', 'label' => 'Csak a „Teljes kérdéssor” gomb megnyomása után látszik'],
            ],
        ],
        'cicaor_gallery' => [
            'menu' => 'Galéria',
            'singular' => 'Galériakép',
            'title' => 'Képaláírás (ez a kép leírása is)',
            'fields' => [
                'image' => ['type' => 'image', 'label' => 'Kép (amíg nincs feltöltve, mintakép látszik)', 'optional' => true],
            ],
        ],
    ];
}

/**
 * Single texts and images, grouped into sections on the "Szövegek és képek" page. Keys are paths in the JSON
 * the site receives ("homeHero.title" → { homeHero: { title } }).
 *
 * @return array<string, array{title: string, fields: array<string, array<string, mixed>>}>
 */
function cicaor_text_sections(): array
{
    $heading = fn (string $prefix) => [
        "{$prefix}.eyebrow" => ['type' => 'text', 'label' => 'Kis felirat a cím felett'],
        "{$prefix}.title" => ['type' => 'text', 'label' => 'Cím'],
    ];
    $twoLineTitle = fn (string $prefix) => [
        "{$prefix}.eyebrow" => ['type' => 'text', 'label' => 'Kis felirat a cím felett'],
        "{$prefix}.titleLines.0" => ['type' => 'text', 'label' => 'Cím, 1. sor'],
        "{$prefix}.titleLines.1" => ['type' => 'text', 'label' => 'Cím, 2. sor'],
    ];
    $alt = ['type' => 'text', 'label' => 'A kép rövid leírása (alt szöveg)'];

    return [
        'general' => ['title' => 'Általános', 'fields' => [
            'siteDescription' => ['type' => 'textarea', 'label' => 'Az oldal leírása a keresőknek (kb. 150 karakter)'],
        ]],
        'hero' => ['title' => 'Nyitókép', 'fields' => [
            'homeHero.eyebrow' => ['type' => 'text', 'label' => 'Kis felirat a cím felett'],
            'homeHero.title' => ['type' => 'text', 'label' => 'Cím'],
            'homeHero.subtitle' => ['type' => 'text', 'label' => 'Alcím'],
            'homeHero.body' => ['type' => 'textarea', 'label' => 'Szöveg'],
            'homeHero.cta' => ['type' => 'text', 'label' => 'Gomb felirata'],
            'homeHero.script' => ['type' => 'text', 'label' => 'Kézírásos felirat'],
            'homeHero.image' => ['type' => 'image', 'label' => 'Háttérkép'],
            'homeHero.imageAlt' => $alt,
        ]],
        'packages' => ['title' => 'Árak szakasz', 'fields' => [
            ...$heading('packages'),
            'packages.subtitle' => ['type' => 'textarea', 'label' => 'Bevezető szöveg'],
        ]],
        'addOns' => ['title' => 'Felárak szakasz', 'fields' => [
            ...$heading('addOns'),
            'addOns.subtitle' => ['type' => 'text', 'label' => 'Bevezető szöveg'],
        ]],
        'about' => ['title' => 'Rólam', 'fields' => [
            ...$twoLineTitle('about'),
            'about.body' => ['type' => 'textarea', 'label' => 'Bemutatkozás'],
            'about.points' => ['type' => 'lines', 'label' => 'Pipás pontok (soronként egy)'],
            'about.script' => ['type' => 'text', 'label' => 'Kézírásos felirat'],
            'about.quote' => ['type' => 'text', 'label' => 'Idézet'],
            'about.image' => ['type' => 'image', 'label' => 'Fotó rólad (amíg nincs feltöltve, mintakép látszik)', 'optional' => true],
            'about.imageAlt' => $alt,
            'about.quoteImage' => ['type' => 'image', 'label' => 'Kép az idézet felett'],
            'about.quoteImageAlt' => $alt,
        ]],
        'services' => ['title' => 'Szolgáltatások szakasz', 'fields' => [
            ...$heading('services'),
            'services.subtitle' => ['type' => 'text', 'label' => 'Bevezető szöveg'],
        ]],
        'gallery' => ['title' => 'Galéria szakasz', 'fields' => [
            ...$twoLineTitle('gallery'),
            'gallery.body' => ['type' => 'text', 'label' => 'Szöveg'],
            'gallery.cta' => ['type' => 'text', 'label' => 'Gomb felirata'],
            'gallery.image' => ['type' => 'image', 'label' => 'Kép a sáv bal szélén (amíg nincs feltöltve, mintakép látszik)', 'optional' => true],
            'gallery.imageAlt' => $alt,
        ]],
        'reviews' => ['title' => 'Vélemények szakasz', 'fields' => $heading('reviews')],
        'faq' => ['title' => 'GYIK szakasz', 'fields' => [
            ...$heading('faq'),
            'faq.body' => ['type' => 'textarea', 'label' => 'Bevezető szöveg'],
            'faq.image' => ['type' => 'image', 'label' => 'Kép'],
            'faq.imageAlt' => $alt,
        ]],
        'closing' => ['title' => 'Záró sáv', 'fields' => [
            'closing.title' => ['type' => 'text', 'label' => 'Cím'],
            'closing.body' => ['type' => 'text', 'label' => 'Szöveg'],
            'closing.cta' => ['type' => 'text', 'label' => 'Gomb felirata'],
        ]],
    ];
}

/** @return array<string, array<string, mixed>> every text field, keyed by path */
function cicaor_text_fields(): array
{
    return array_merge(...array_values(array_map(fn (array $section) => $section['fields'], cicaor_text_sections())));
}

/** Cleans one submitted value according to its field type. */
function cicaor_sanitize_field(array $field, mixed $value): string|int|bool
{
    $value = is_string($value) ? wp_unslash($value) : $value;

    return match ($field['type']) {
        'text' => sanitize_text_field((string) $value),
        'textarea', 'lines' => sanitize_textarea_field((string) $value),
        'number' => absint($value),
        'checkbox' => $value === '1',
        'select' => array_key_exists((string) $value, $field['options']) ? (string) $value : (string) array_key_first($field['options']),
        'image' => wp_attachment_is_image(absint($value)) ? absint($value) : 0,
    };
}
