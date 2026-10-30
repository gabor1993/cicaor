<?php

declare(strict_types=1);

add_action('rest_api_init', function (): void {
    // Public on purpose: it only returns what the public website shows anyway.
    register_rest_route('cicaor/v1', '/content', [
        'methods' => 'GET',
        'callback' => fn () => rest_ensure_response(cicaor_content()),
        'permission_callback' => '__return_true',
    ]);
});

/**
 * The whole editable content in the shape of frontend/src/content/site-content-schema.ts, with absolute image
 * URLs. The site downloads those images at build time and validates the result, so a gap here fails the build.
 *
 * @return array<string, mixed>
 */
function cicaor_content(): array
{
    $content = cicaor_texts_tree();

    $content['features'] = cicaor_map_items('cicaor_feature', fn (WP_Post $post, callable $meta) => [
        'icon' => $meta('icon'),
        'title' => $post->post_title,
        'body' => $meta('body'),
    ]);
    $content['packages']['items'] = cicaor_map_items('cicaor_package', fn (WP_Post $post, callable $meta) => [
        'id' => $post->post_name,
        'label' => $meta('label'),
        'name' => $post->post_title,
        'tagline' => $meta('tagline'),
        'visitRate' => ['base' => (int) $meta('visit_base'), 'step' => (int) $meta('visit_step')],
        'multiDayRate' => ['base' => (int) $meta('multi_base'), 'step' => (int) $meta('multi_step')],
        'features' => cicaor_lines($meta('features')),
        'popular' => (bool) $meta('popular'),
        'image' => cicaor_image_url($meta('image')),
        'imageAlt' => $meta('image_alt'),
    ]);
    $content['addOns']['items'] = cicaor_map_items('cicaor_addon', fn (WP_Post $post, callable $meta) => [
        'id' => $post->post_name,
        'icon' => $meta('icon'),
        'name' => $post->post_title,
        'price' => $meta('price'),
        'unit' => $meta('unit'),
        'note' => $meta('note'),
    ]);
    $content['services']['items'] = cicaor_map_items('cicaor_service', fn (WP_Post $post, callable $meta) => [
        'icon' => $meta('icon'),
        'title' => $post->post_title,
        'body' => $meta('body'),
        'image' => cicaor_image_url($meta('image')),
        'imageAlt' => $meta('image_alt'),
    ]);
    $content['gallery']['items'] = cicaor_map_items('cicaor_gallery', fn (WP_Post $post, callable $meta) => [
        'caption' => $post->post_title,
        'image' => cicaor_image_url($meta('image')),
    ]);
    $content['reviews']['items'] = cicaor_map_items('cicaor_review', fn (WP_Post $post, callable $meta) => [
        'quote' => $meta('quote'),
        'author' => $post->post_title,
    ]);

    $faq = cicaor_map_items('cicaor_faq', fn (WP_Post $post, callable $meta) => [
        'q' => $post->post_title,
        'a' => $meta('answer'),
        'more' => (bool) $meta('more'),
    ]);
    $strip = fn (array $item) => ['q' => $item['q'], 'a' => $item['a']];
    $content['faq']['items'] = array_values(array_map($strip, array_filter($faq, fn ($item) => !$item['more'])));
    $content['faq']['moreItems'] = array_values(array_map($strip, array_filter($faq, fn ($item) => $item['more'])));

    return $content;
}

/** Turns the flat "homeHero.title" => value texts into nested arrays, resolving images to URLs. */
function cicaor_texts_tree(): array
{
    $texts = cicaor_texts();
    $tree = [];
    foreach (cicaor_text_fields() as $path => $field) {
        $value = $texts[$path] ?? '';
        $value = match ($field['type']) {
            'image' => cicaor_image_url($value),
            'lines' => cicaor_lines((string) $value),
            default => $value,
        };
        $node = &$tree;
        foreach (explode('.', $path) as $key) {
            $node = &$node[$key];
        }
        $node = $value;
        unset($node);
    }
    return $tree;
}

/**
 * Published posts of one type in the order set in the admin ("Sorrend").
 *
 * @param callable(WP_Post, callable(string): mixed): array<string, mixed> $map
 * @return list<array<string, mixed>>
 */
function cicaor_map_items(string $type, callable $map): array
{
    $posts = get_posts([
        'post_type' => $type,
        'post_status' => 'publish',
        'numberposts' => -1,
        'orderby' => ['menu_order' => 'ASC', 'ID' => 'ASC'],
    ]);
    return array_map(fn (WP_Post $post) => $map($post, fn (string $key) => get_post_meta($post->ID, "_cicaor_{$key}", true)), $posts);
}

/** @return list<string> */
function cicaor_lines(mixed $value): array
{
    return array_values(array_filter(array_map('trim', preg_split('/\R/', (string) $value) ?: [])));
}

function cicaor_image_url(mixed $attachmentId): ?string
{
    $id = absint($attachmentId);
    // The original upload: the site build resizes and converts it, so editors can upload phone photos as they are.
    return $id ? (wp_get_attachment_image_url($id, 'full') ?: null) : null;
}
