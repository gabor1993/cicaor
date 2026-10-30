<?php
/** @var array<string, string> $rows label => value */
?>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;border-top:1px solid #e6e2d6;">
<?php foreach ($rows as $label => $value): ?>
  <tr>
    <td style="padding:10px 12px 10px 0;border-bottom:1px solid #e6e2d6;color:#5a5d4a;font-size:13px;white-space:nowrap;vertical-align:top;"><?= e($label) ?></td>
    <td style="padding:10px 0;border-bottom:1px solid #e6e2d6;font-weight:bold;"><?= e($value) ?></td>
  </tr>
<?php endforeach; ?>
</table>
