<?php
/**
 * @var array<string, string> $rows
 * @var string $message
 * @var string $email
 */
?>
<p style="margin:0 0 8px;">Új üzenet érkezett a weboldal kapcsolatfelvételi űrlapjáról.</p>
<?= renderTemplate('details-table', ['rows' => $rows]) ?>
<p style="margin:0 0 6px;color:#5a5d4a;font-size:13px;">Üzenet</p>
<div style="margin:0 0 24px;padding:16px;background-color:#ebe6dc;border-radius:12px;"><?= nl2br(e($message)) ?></div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="border-radius:999px;background-color:#4e513a;">
      <a href="mailto:<?= e($email) ?>" style="display:inline-block;padding:12px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#f6f3ec;text-decoration:none;">Válasz küldése</a>
    </td>
  </tr>
</table>
