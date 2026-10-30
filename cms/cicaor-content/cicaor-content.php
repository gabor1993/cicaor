<?php
/**
 * Plugin Name: CicaŐr tartalom
 * Description: Headless content for the CicaŐr website: editable packages, add-ons, FAQ, reviews, texts and images, served as one JSON endpoint and published by a Netlify build hook.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Author: GABENIX
 * Text Domain: cicaor-content
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

const CICAOR_VERSION = '1.0.0';
const CICAOR_FILE = __FILE__;
const CICAOR_MENU = 'cicaor';
const CICAOR_TEXTS_OPTION = 'cicaor_texts';
const CICAOR_SETTINGS_OPTION = 'cicaor_settings';

require_once __DIR__ . '/includes/fields.php';
require_once __DIR__ . '/includes/admin.php';
require_once __DIR__ . '/includes/content-api.php';
require_once __DIR__ . '/includes/import.php';
require_once __DIR__ . '/includes/build-hook.php';
require_once __DIR__ . '/includes/headless.php';
