<?php

declare(strict_types=1);

add_action('init', 'cicaor_register_post_types');
// Before the post type submenus (priority 10), so "Szövegek és képek" is the first item.
add_action('admin_menu', 'cicaor_register_menu', 9);
add_action('add_meta_boxes', 'cicaor_add_meta_boxes');
add_action('save_post', 'cicaor_save_post_fields', 10, 2);
add_action('admin_enqueue_scripts', 'cicaor_enqueue_admin_assets');
add_action('admin_post_cicaor_save_texts', 'cicaor_save_texts');
add_filter('enter_title_here', 'cicaor_title_placeholder', 10, 2);

// Admin lists follow the "Sorrend" field, the same order the website uses.
add_action('pre_get_posts', function (WP_Query $query): void {
    if (is_admin() && $query->is_main_query() && array_key_exists((string) $query->get('post_type'), cicaor_collections()) && !$query->get('orderby')) {
        $query->set('orderby', ['menu_order' => 'ASC', 'ID' => 'ASC']);
    }
});

// Quick edit exposes the slug, which is the package and add-on id the website relies on.
add_filter('post_row_actions', function (array $actions, WP_Post $post): array {
    if (array_key_exists($post->post_type, cicaor_collections())) {
        unset($actions['inline hide-if-no-js']);
    }
    return $actions;
}, 10, 2);

function cicaor_register_post_types(): void
{
    foreach (cicaor_collections() as $type => $config) {
        register_post_type($type, [
            'labels' => [
                'name' => $config['menu'],
                'singular_name' => $config['singular'],
                'add_new_item' => "Új: {$config['singular']}",
                'edit_item' => "{$config['singular']} szerkesztése",
            ],
            // Not public and not in the core REST API: the site reads everything from /cicaor/v1/content.
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => CICAOR_MENU,
            'show_in_rest' => false,
            'supports' => ['title', 'page-attributes'],
            'map_meta_cap' => true,
            'capabilities' => !empty($config['fixed']) ? ['create_posts' => 'do_not_allow'] : [],
        ]);
    }
}

function cicaor_register_menu(): void
{
    add_menu_page('CicaŐr tartalom', 'CicaŐr tartalom', 'edit_posts', CICAOR_MENU, 'cicaor_render_texts_page', 'dashicons-pets', 3);
    add_submenu_page(CICAOR_MENU, 'Szövegek és képek', 'Szövegek és képek', 'edit_posts', CICAOR_MENU, 'cicaor_render_texts_page');
}

function cicaor_title_placeholder(string $placeholder, WP_Post $post): string
{
    return cicaor_collections()[$post->post_type]['title'] ?? $placeholder;
}

function cicaor_enqueue_admin_assets(string $hook): void
{
    $screen = get_current_screen();
    $ours = $screen && (array_key_exists($screen->post_type, cicaor_collections()) || str_contains($hook, CICAOR_MENU));
    if (!$ours) {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script('cicaor-media-field', plugins_url('assets/media-field.js', CICAOR_FILE), ['jquery'], CICAOR_VERSION, true);
    wp_enqueue_style('cicaor-admin', plugins_url('assets/admin.css', CICAOR_FILE), [], CICAOR_VERSION);
}

function cicaor_add_meta_boxes(): void
{
    foreach (cicaor_collections() as $type => $config) {
        add_meta_box('cicaor-fields', 'Adatok', 'cicaor_render_post_fields', $type, 'normal', 'high');
    }
}

function cicaor_render_post_fields(WP_Post $post): void
{
    $config = cicaor_collections()[$post->post_type];
    wp_nonce_field('cicaor_save_post', 'cicaor_nonce');
    if (!empty($config['help'])) {
        echo '<p class="description">' . esc_html($config['help']) . '</p>';
    }
    echo '<table class="form-table" role="presentation">';
    foreach ($config['fields'] as $key => $field) {
        cicaor_render_field("cicaor[{$key}]", "cicaor-{$key}", $field, get_post_meta($post->ID, "_cicaor_{$key}", true));
    }
    echo '</table>';
}

function cicaor_save_post_fields(int $postId, WP_Post $post): void
{
    $config = cicaor_collections()[$post->post_type] ?? null;
    if ($config === null || wp_is_post_autosave($postId) || wp_is_post_revision($postId)) {
        return;
    }
    $nonce = isset($_POST['cicaor_nonce']) ? sanitize_text_field(wp_unslash($_POST['cicaor_nonce'])) : '';
    if (!wp_verify_nonce($nonce, 'cicaor_save_post') || !current_user_can('edit_post', $postId)) {
        return;
    }
    $input = isset($_POST['cicaor']) && is_array($_POST['cicaor']) ? $_POST['cicaor'] : [];
    foreach ($config['fields'] as $key => $field) {
        update_post_meta($postId, "_cicaor_{$key}", cicaor_sanitize_field($field, $input[$key] ?? ''));
    }
}

/** Prints one table row with the right input for the field type. Every value is escaped on output. */
function cicaor_render_field(string $name, string $id, array $field, mixed $value): void
{
    $label = esc_html($field['label']);
    echo '<tr><th scope="row"><label for="' . esc_attr($id) . '">' . $label . '</label></th><td>';

    switch ($field['type']) {
        case 'textarea':
        case 'lines':
            $rows = $field['type'] === 'lines' ? 5 : 4;
            echo '<textarea class="large-text" rows="' . $rows . '" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '">' . esc_textarea((string) $value) . '</textarea>';
            break;
        case 'number':
            echo '<input type="number" min="0" step="50" class="small-text cicaor-number" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" value="' . esc_attr((string) $value) . '"> Ft';
            break;
        case 'checkbox':
            echo '<input type="checkbox" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" value="1"' . checked((bool) $value, true, false) . '>';
            break;
        case 'select':
            echo '<select id="' . esc_attr($id) . '" name="' . esc_attr($name) . '">';
            foreach ($field['options'] as $optionValue => $optionLabel) {
                echo '<option value="' . esc_attr($optionValue) . '"' . selected((string) $value, $optionValue, false) . '>' . esc_html($optionLabel) . '</option>';
            }
            echo '</select>';
            break;
        case 'image':
            $imageId = absint($value);
            $preview = $imageId ? wp_get_attachment_image_url($imageId, 'medium') : '';
            echo '<div class="cicaor-media">';
            echo '<input type="hidden" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" value="' . esc_attr($imageId ? (string) $imageId : '') . '">';
            echo '<img alt="" src="' . esc_url((string) $preview) . '"' . ($preview ? '' : ' hidden') . '>';
            echo '<p><button type="button" class="button" data-cicaor-media="select">Kép kiválasztása</button> ';
            echo '<button type="button" class="button-link" data-cicaor-media="remove">Eltávolítás</button></p>';
            echo '</div>';
            break;
        default:
            echo '<input type="text" class="regular-text" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" value="' . esc_attr((string) $value) . '">';
    }

    echo '</td></tr>';
}

/** @return array<string, mixed> saved texts, keyed by path */
function cicaor_texts(): array
{
    $texts = get_option(CICAOR_TEXTS_OPTION, []);
    return is_array($texts) ? $texts : [];
}

function cicaor_render_texts_page(): void
{
    if (!current_user_can('edit_posts')) {
        return;
    }
    $texts = cicaor_texts();
    echo '<div class="wrap"><h1>Szövegek és képek</h1>';
    cicaor_render_notice();
    echo '<p>A módosítások mentés után kb. 1–2 percen belül megjelennek a weboldalon.</p>';
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    echo '<input type="hidden" name="action" value="cicaor_save_texts">';
    wp_nonce_field('cicaor_save_texts', 'cicaor_nonce');
    foreach (cicaor_text_sections() as $sectionId => $section) {
        echo '<h2 id="' . esc_attr("section-{$sectionId}") . '">' . esc_html($section['title']) . '</h2>';
        echo '<table class="form-table" role="presentation">';
        foreach ($section['fields'] as $path => $field) {
            cicaor_render_field("cicaor[{$path}]", 'cicaor-' . str_replace('.', '-', $path), $field, $texts[$path] ?? '');
        }
        echo '</table>';
    }
    submit_button('Mentés');
    echo '</form>';
    cicaor_render_build_box();
    echo '</div>';
}

function cicaor_save_texts(): void
{
    $nonce = isset($_POST['cicaor_nonce']) ? sanitize_text_field(wp_unslash($_POST['cicaor_nonce'])) : '';
    if (!wp_verify_nonce($nonce, 'cicaor_save_texts') || !current_user_can('edit_posts')) {
        wp_die('Nincs jogosultságod ehhez a művelethez.', 403);
    }
    $input = isset($_POST['cicaor']) && is_array($_POST['cicaor']) ? $_POST['cicaor'] : [];
    $texts = [];
    foreach (cicaor_text_fields() as $path => $field) {
        $texts[$path] = cicaor_sanitize_field($field, $input[$path] ?? '');
    }
    update_option(CICAOR_TEXTS_OPTION, $texts, false);
    cicaor_redirect_with_notice(admin_url('admin.php?page=' . CICAOR_MENU), 'saved');
}

function cicaor_redirect_with_notice(string $url, string $notice): never
{
    wp_safe_redirect(add_query_arg('cicaor_notice', $notice, $url));
    exit;
}

function cicaor_render_notice(): void
{
    $messages = [
        'saved' => ['success', 'Elmentve. A weboldal hamarosan frissül.'],
        'build' => ['success', 'A weboldal frissítése elindult.'],
        'build_failed' => ['error', 'A weboldal frissítését nem sikerült elindítani. Ellenőrizd a build hook címét.'],
        'settings' => ['success', 'Beállítások elmentve.'],
        'imported' => ['success', 'A kezdeti tartalom betöltve.'],
        'import_skipped' => ['warning', 'Már van tartalom, ezért a betöltés nem futott le.'],
        'import_failed' => ['error', 'A kezdeti tartalom betöltése nem sikerült. A részletek a szerver naplójában vannak.'],
    ];
    $key = isset($_GET['cicaor_notice']) ? sanitize_key(wp_unslash($_GET['cicaor_notice'])) : '';
    if (isset($messages[$key])) {
        [$type, $text] = $messages[$key];
        echo '<div class="notice notice-' . esc_attr($type) . ' is-dismissible"><p>' . esc_html($text) . '</p></div>';
    }
}
