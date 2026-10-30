<?php

declare(strict_types=1);

// This WordPress only serves the admin and the content endpoint; the public website is the static Next.js site.

// "xmlrpc_enabled" only switches off the authenticated methods; pingback.ping, which can be abused to flood
// other sites, stays unless the method list is emptied as well.
add_filter('xmlrpc_enabled', '__return_false');
add_filter('xmlrpc_methods', '__return_empty_array');

// Search engines must not index the CMS.
add_action('send_headers', fn () => header('X-Robots-Tag: noindex, nofollow'));

// The core users endpoint lists author names to anyone, which helps password-guessing attacks.
add_filter('rest_endpoints', function (array $endpoints): array {
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});

// Visitors of the CMS front end are sent to the real website.
add_action('template_redirect', function (): void {
    if (is_admin() || wp_doing_cron() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return;
    }
    $siteUrl = cicaor_settings()['site_url'];
    if ($siteUrl !== '') {
        // wp_redirect, not wp_safe_redirect: the target is another domain, set by an administrator.
        wp_redirect($siteUrl, 302);
        exit;
    }
    status_header(404);
    nocache_headers();
    exit;
});
