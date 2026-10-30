<?php

declare(strict_types=1);

// Builds dist/cicaor-content.zip for "Plugins → Add New → Upload Plugin", with the site's current content as seed.
// Usage: php cms/bundle.php

$pluginDir = __DIR__ . '/cicaor-content';
$frontend = dirname(__DIR__) . '/frontend';
$seedDir = "{$pluginDir}/seed";

$json = file_get_contents("{$frontend}/src/content/site-content.json");
$content = json_decode((string) $json, true, 32, JSON_THROW_ON_ERROR);

@mkdir("{$seedDir}/images", 0777, true);
foreach (glob("{$seedDir}/images/*") ?: [] as $stale) {
    unlink($stale);
}
copy("{$frontend}/src/content/site-content.json", "{$seedDir}/site-content.json");

// Every local image path in the content, e.g. "/images/hero.webp" from frontend/public.
$images = [];
array_walk_recursive($content, function (mixed $value) use (&$images): void {
    if (is_string($value) && preg_match('#^/[\w\-./]+\.(webp|jpe?g|png)$#', $value)) {
        $images[$value] = true;
    }
});
foreach (array_keys($images) as $path) {
    $source = "{$frontend}/public{$path}";
    if (!is_file($source)) {
        fwrite(STDERR, "Missing image: {$source}\n");
        exit(1);
    }
    copy($source, "{$seedDir}/images/" . basename($path));
}

@mkdir(__DIR__ . '/dist');
$zipPath = __DIR__ . '/dist/cicaor-content.zip';
@unlink($zipPath);
$zip = new ZipArchive();
$zip->open($zipPath, ZipArchive::CREATE);
$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($pluginDir, FilesystemIterator::SKIP_DOTS));
foreach ($files as $file) {
    $relative = substr(str_replace('\\', '/', $file->getPathname()), strlen(str_replace('\\', '/', __DIR__)) + 1);
    $zip->addFile($file->getPathname(), $relative);
}
$zip->close();

echo 'Bundled ' . count($images) . " images into {$zipPath}\n";
