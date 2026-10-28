<?php

declare(strict_types=1);

/**
 * File-based limiter: at most $max requests per $windowSeconds per IP.
 * Good enough for a small contact form; use a shared store (Redis, DB) if the site ever runs on several servers.
 */
function allowRequest(string $ip, int $max, int $windowSeconds): bool
{
    $dir = __DIR__ . '/../storage/rate-limit';
    if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
        error_log('Rate limit directory is not writable, allowing request.');
        return true;
    }

    // Hash the IP so no raw addresses are stored on disk.
    $file = $dir . '/' . hash('sha256', $ip) . '.json';
    $now = time();

    $handle = fopen($file, 'c+');
    if ($handle === false) {
        return true;
    }

    flock($handle, LOCK_EX);
    $stored = json_decode((string) stream_get_contents($handle), true);
    $timestamps = is_array($stored) ? array_filter($stored, fn ($t) => is_int($t) && $t > $now - $windowSeconds) : [];

    $allowed = count($timestamps) < $max;
    if ($allowed) {
        $timestamps[] = $now;
    }

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode(array_values($timestamps)));
    flock($handle, LOCK_UN);
    fclose($handle);

    return $allowed;
}
