<?php
/**
 * Shared email shell. Mail clients ignore most modern CSS, so the layout uses tables and inline styles.
 *
 * @var string $title
 * @var string $preheader
 * @var string $content already escaped HTML
 * @var string $footer
 */
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title><?= e($title) ?></title>
</head>
<body style="margin:0;padding:0;background-color:#f5f4ed;">
  <!-- Preview line shown next to the subject in the inbox -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;"><?= e($preheader) ?></div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f4ed;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;color:#24271d;">CicaŐr</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;color:#5a5d4a;text-transform:uppercase;">Biztonságban a cicád</div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f7f2;border:1px solid #e6e2d6;border-radius:16px;padding:32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#24271d;">
              <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;color:#24271d;"><?= e($title) ?></h1>
              <?= $content ?>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#5a5d4a;">
              <?= e($footer) ?>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
