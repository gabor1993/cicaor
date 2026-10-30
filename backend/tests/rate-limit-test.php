<?php

declare(strict_types=1);

// Dependency-free test runner: `php tests/rate-limit-test.php` (exit code 1 on failure).
require __DIR__ . '/../src/rate-limit.php';

$failures = 0;

function check(string $label, bool $condition): void
{
    global $failures;
    echo ($condition ? 'PASS' : 'FAIL') . " - {$label}\n";
    if (!$condition) {
        $failures++;
    }
}

$dir = sys_get_temp_dir() . '/cicaor-rate-limit-test-' . bin2hex(random_bytes(4));
mkdir($dir);
file_put_contents("{$dir}/stale.json", '[]');
touch("{$dir}/stale.json", time() - 7200);
file_put_contents("{$dir}/fresh.json", '[]');

removeStaleEntries($dir, 3600);
check('removes entries older than the window', !is_file("{$dir}/stale.json"));
check('keeps entries inside the window', is_file("{$dir}/fresh.json"));

unlink("{$dir}/fresh.json");
rmdir($dir);

exit($failures === 0 ? 0 : 1);
