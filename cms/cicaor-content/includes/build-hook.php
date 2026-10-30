<?php

declare(strict_types=1);

const CICAOR_BUILD_DELAY_SECONDS = 60;
const CICAOR_BUILD_STATUS_OPTION = 'cicaor_build_status';
// Only Netlify build hooks are accepted, so the stored URL cannot be used to make the server call anything else.
const CICAOR_BUILD_HOOK_PREFIX = 'https://api.netlify.com/build_hooks/';

add_action('admin_menu', function (): void {
    add_submenu_page(CICAOR_MENU, 'Beállítások', 'Beállítások', 'manage_options', 'cicaor-settings', 'cicaor_render_settings_page');
}, 20);
add_action('admin_post_cicaor_save_settings', 'cicaor_save_settings');
add_action('admin_post_cicaor_build_now', 'cicaor_build_now');
add_action('cicaor_trigger_build', 'cicaor_trigger_build');

// Any change to the content schedules one build; saving several items in a row still results in a single build.
add_action('save_post', function (int $postId, WP_Post $post): void {
    if (cicaor_is_content_post($post) && !wp_is_post_autosave($postId) && !wp_is_post_revision($postId)) {
        cicaor_schedule_build();
    }
}, 20, 2);
foreach (['trashed_post', 'untrashed_post', 'deleted_post'] as $hook) {
    add_action($hook, function (int $postId): void {
        $post = get_post($postId);
        if ($post && cicaor_is_content_post($post)) {
            cicaor_schedule_build();
        }
    });
}
add_action('update_option_' . CICAOR_TEXTS_OPTION, 'cicaor_schedule_build');
add_action('add_attachment', 'cicaor_schedule_build');

function cicaor_is_content_post(WP_Post $post): bool
{
    return array_key_exists($post->post_type, cicaor_collections());
}

/** @return array{build_hook_url: string, site_url: string} */
function cicaor_settings(): array
{
    $settings = get_option(CICAOR_SETTINGS_OPTION, []);
    return [
        'build_hook_url' => (string) ($settings['build_hook_url'] ?? ''),
        'site_url' => (string) ($settings['site_url'] ?? ''),
    ];
}

function cicaor_schedule_build(): void
{
    if (cicaor_settings()['build_hook_url'] !== '' && !wp_next_scheduled('cicaor_trigger_build')) {
        wp_schedule_single_event(time() + CICAOR_BUILD_DELAY_SECONDS, 'cicaor_trigger_build');
    }
}

function cicaor_trigger_build(): bool
{
    $url = cicaor_settings()['build_hook_url'];
    if ($url === '') {
        return false;
    }
    $response = wp_remote_post($url, ['timeout' => 10]);
    $ok = !is_wp_error($response) && wp_remote_retrieve_response_code($response) < 300;
    if (!$ok) {
        error_log('CicaŐr build hook failed: ' . (is_wp_error($response) ? $response->get_error_message() : wp_remote_retrieve_response_code($response)));
    }
    update_option(CICAOR_BUILD_STATUS_OPTION, ['time' => time(), 'ok' => $ok], false);
    return $ok;
}

function cicaor_build_now(): void
{
    check_admin_referer('cicaor_build_now', 'cicaor_nonce');
    if (!current_user_can(CICAOR_EDIT_CAP)) {
        wp_die('Nincs jogosultságod ehhez a művelethez.', 403);
    }
    wp_clear_scheduled_hook('cicaor_trigger_build');
    cicaor_redirect_with_notice(admin_url('admin.php?page=' . CICAOR_MENU), cicaor_trigger_build() ? 'build' : 'build_failed');
}

function cicaor_render_build_box(): void
{
    $status = get_option(CICAOR_BUILD_STATUS_OPTION);
    echo '<hr><h2>Weboldal frissítése</h2>';
    if (cicaor_settings()['build_hook_url'] === '') {
        echo '<p>A weboldal automatikus frissítése még nincs beállítva (Beállítások menüpont).</p>';
        return;
    }
    if (is_array($status)) {
        $when = wp_date('Y. m. d. H:i', (int) $status['time']);
        echo '<p>Utolsó frissítés indítása: ' . esc_html($when) . ' – ' . esc_html($status['ok'] ? 'sikeres' : 'sikertelen') . '</p>';
    }
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    echo '<input type="hidden" name="action" value="cicaor_build_now">';
    wp_nonce_field('cicaor_build_now', 'cicaor_nonce');
    submit_button('Weboldal frissítése most', 'secondary', 'submit', false);
    echo '</form>';
}

function cicaor_render_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $settings = cicaor_settings();
    echo '<div class="wrap"><h1>Beállítások</h1>';
    cicaor_render_notice();
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    echo '<input type="hidden" name="action" value="cicaor_save_settings">';
    wp_nonce_field('cicaor_save_settings', 'cicaor_nonce');
    echo '<table class="form-table" role="presentation">';
    echo '<tr><th scope="row"><label for="cicaor-site-url">A weboldal címe</label></th><td>';
    echo '<input type="url" class="regular-text" id="cicaor-site-url" name="site_url" value="' . esc_attr($settings['site_url']) . '" placeholder="https://cicaor.hu">';
    echo '<p class="description">Aki ezt a WordPress oldalt nyitja meg, ide lesz átirányítva.</p></td></tr>';
    echo '<tr><th scope="row"><label for="cicaor-build-hook">Netlify build hook</label></th><td>';
    // The hook URL works like a password: anyone holding it can start builds, so it is never printed back in full.
    $masked = $settings['build_hook_url'] !== '' ? CICAOR_BUILD_HOOK_PREFIX . '••••••' : '';
    echo '<input type="url" class="regular-text" id="cicaor-build-hook" name="build_hook_url" value="" placeholder="' . esc_attr($masked ?: CICAOR_BUILD_HOOK_PREFIX . '…') . '" autocomplete="off">';
    echo '<p class="description">Netlify: Site configuration → Build &amp; deploy → Build hooks. Üresen hagyva a mentett érték megmarad.</p></td></tr>';
    echo '</table>';
    submit_button('Mentés');
    echo '</form></div>';
}

function cicaor_save_settings(): void
{
    check_admin_referer('cicaor_save_settings', 'cicaor_nonce');
    if (!current_user_can('manage_options')) {
        wp_die('Nincs jogosultságod ehhez a művelethez.', 403);
    }
    $settings = cicaor_settings();
    $siteUrl = esc_url_raw(trim(wp_unslash((string) ($_POST['site_url'] ?? ''))), ['https', 'http']);
    $settings['site_url'] = $siteUrl;
    $hook = trim(wp_unslash((string) ($_POST['build_hook_url'] ?? '')));
    if ($hook !== '') {
        $settings['build_hook_url'] = str_starts_with($hook, CICAOR_BUILD_HOOK_PREFIX) ? esc_url_raw($hook, ['https']) : '';
    }
    update_option(CICAOR_SETTINGS_OPTION, $settings, false);
    cicaor_redirect_with_notice(admin_url('admin.php?page=cicaor-settings'), 'settings');
}
