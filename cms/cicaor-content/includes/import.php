<?php

declare(strict_types=1);

// One-off import of the site's current content (seed/, created by cms/bundle.php) into an empty WordPress.

add_action('admin_menu', function (): void {
    add_submenu_page(CICAOR_MENU, 'Kezdeti tartalom', 'Kezdeti tartalom', 'manage_options', 'cicaor-import', 'cicaor_render_import_page');
}, 30);
add_action('admin_post_cicaor_import', 'cicaor_handle_import');

function cicaor_seed_dir(): string
{
    return dirname(CICAOR_FILE) . '/seed';
}

function cicaor_has_content(): bool
{
    foreach (array_keys(cicaor_collections()) as $type) {
        if (get_posts(['post_type' => $type, 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids']) !== []) {
            return true;
        }
    }
    return cicaor_texts() !== [];
}

function cicaor_render_import_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    echo '<div class="wrap"><h1>Kezdeti tartalom</h1>';
    cicaor_render_notice();
    if (cicaor_has_content()) {
        echo '<p>A tartalom már be van töltve. Innentől a menüpontokban szerkesztheted.</p></div>';
        return;
    }
    if (!is_readable(cicaor_seed_dir() . '/site-content.json')) {
        echo '<p>Ebben a bővítménycsomagban nincs kezdeti tartalom.</p></div>';
        return;
    }
    echo '<p>Betölti a weboldal jelenlegi szövegeit, árait és képeit, hogy ne kelljen mindent kézzel felvinni. Csak üres tartalomnál fut le.</p>';
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    echo '<input type="hidden" name="action" value="cicaor_import">';
    wp_nonce_field('cicaor_import', 'cicaor_nonce');
    submit_button('Kezdeti tartalom betöltése');
    echo '</form></div>';
}

function cicaor_handle_import(): void
{
    check_admin_referer('cicaor_import', 'cicaor_nonce');
    if (!current_user_can('manage_options')) {
        wp_die('Nincs jogosultságod ehhez a művelethez.', 403);
    }
    $back = admin_url('admin.php?page=cicaor-import');
    if (cicaor_has_content()) {
        cicaor_redirect_with_notice($back, 'import_skipped');
    }
    try {
        cicaor_import_seed();
    } catch (Throwable $exception) {
        error_log('CicaŐr import failed: ' . $exception->getMessage());
        cicaor_redirect_with_notice($back, 'import_failed');
    }
    cicaor_redirect_with_notice($back, 'imported');
}

function cicaor_import_seed(): void
{
    $json = file_get_contents(cicaor_seed_dir() . '/site-content.json');
    $content = json_decode((string) $json, true, 32, JSON_THROW_ON_ERROR);

    $texts = [];
    foreach (cicaor_text_fields() as $path => $field) {
        $value = cicaor_value_at($content, $path);
        $texts[$path] = match ($field['type']) {
            'image' => cicaor_import_image($value, (string) cicaor_value_at($content, $path . 'Alt')),
            'lines' => implode("\n", (array) $value),
            default => (string) $value,
        };
    }
    update_option(CICAOR_TEXTS_OPTION, $texts, false);

    foreach ($content['packages']['items'] as $index => $pkg) {
        cicaor_import_post('cicaor_package', $pkg['name'], $index, [
            'label' => $pkg['label'],
            'tagline' => $pkg['tagline'],
            'visit_base' => $pkg['visitRate']['base'],
            'visit_step' => $pkg['visitRate']['step'],
            'multi_base' => $pkg['multiDayRate']['base'],
            'multi_step' => $pkg['multiDayRate']['step'],
            'features' => implode("\n", $pkg['features']),
            'popular' => $pkg['popular'],
            'image' => cicaor_import_image($pkg['image'], $pkg['imageAlt']),
            'image_alt' => $pkg['imageAlt'],
        ], $pkg['id']);
    }
    foreach ($content['addOns']['items'] as $index => $item) {
        cicaor_import_post('cicaor_addon', $item['name'], $index, [
            'icon' => $item['icon'], 'price' => $item['price'], 'unit' => $item['unit'], 'note' => $item['note'],
        ], $item['id']);
    }
    foreach ($content['features'] as $index => $item) {
        cicaor_import_post('cicaor_feature', $item['title'], $index, ['icon' => $item['icon'], 'body' => $item['body']]);
    }
    foreach ($content['services']['items'] as $index => $item) {
        cicaor_import_post('cicaor_service', $item['title'], $index, [
            'icon' => $item['icon'],
            'body' => $item['body'],
            'image' => cicaor_import_image($item['image'], $item['imageAlt']),
            'image_alt' => $item['imageAlt'],
        ]);
    }
    foreach ($content['reviews']['items'] as $index => $item) {
        cicaor_import_post('cicaor_review', $item['author'], $index, ['quote' => $item['quote']]);
    }
    $questions = [
        ...array_map(fn ($item) => [...$item, 'more' => false], $content['faq']['items']),
        ...array_map(fn ($item) => [...$item, 'more' => true], $content['faq']['moreItems']),
    ];
    foreach ($questions as $index => $item) {
        cicaor_import_post('cicaor_faq', $item['q'], $index, ['answer' => $item['a'], 'more' => $item['more']]);
    }
    foreach ($content['gallery']['items'] as $index => $item) {
        cicaor_import_post('cicaor_gallery', $item['caption'], $index, [
            'image' => cicaor_import_image($item['image'], $item['caption']),
        ]);
    }
}

/** @param array<string, mixed> $meta */
function cicaor_import_post(string $type, string $title, int $order, array $meta, string $slug = ''): void
{
    $postId = wp_insert_post([
        'post_type' => $type,
        'post_status' => 'publish',
        'post_title' => $title,
        'post_name' => $slug,
        'menu_order' => $order,
    ], true);
    if (is_wp_error($postId)) {
        throw new RuntimeException("Could not create {$type} \"{$title}\": " . $postId->get_error_message());
    }
    foreach ($meta as $key => $value) {
        update_post_meta($postId, "_cicaor_{$key}", $value);
    }
}

/** Adds a seed image ("/images/hero.webp") to the media library once and returns its attachment ID (0 for none). */
function cicaor_import_image(mixed $src, string $alt): int
{
    static $imported = [];
    if (!is_string($src) || $src === '') {
        return 0;
    }
    if (isset($imported[$src])) {
        return $imported[$src];
    }
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $source = cicaor_seed_dir() . '/images/' . basename($src);
    if (!is_readable($source)) {
        throw new RuntimeException("Seed image is missing: {$src}");
    }
    // media_handle_sideload() moves the file, so it gets a temporary copy and the seed stays intact.
    $tmp = wp_tempnam(basename($source));
    copy($source, $tmp);
    $id = media_handle_sideload(['name' => basename($source), 'tmp_name' => $tmp], 0, $alt);
    if (is_wp_error($id)) {
        @unlink($tmp);
        throw new RuntimeException("Could not import {$src}: " . $id->get_error_message());
    }
    update_post_meta($id, '_wp_attachment_image_alt', $alt);
    return $imported[$src] = $id;
}

function cicaor_value_at(array $data, string $path): mixed
{
    foreach (explode('.', $path) as $key) {
        if (!is_array($data) || !array_key_exists($key, $data)) {
            return null;
        }
        $data = $data[$key];
    }
    return $data;
}
