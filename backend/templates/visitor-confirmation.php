<?php
/**
 * The message text is left out on purpose: anyone can type someone else's address into the form,
 * so this mail must not carry content the sender controls.
 *
 * @var string $name
 * @var array<string, string> $rows
 */
?>
<p style="margin:0 0 12px;">Kedves <?= e($name) ?>!</p>
<p style="margin:0 0 12px;">Köszönöm, hogy írtál! Megkaptam az üzenetedet, és hamarosan válaszolok.</p>
<?= renderTemplate('details-table', ['rows' => $rows]) ?>
<p style="margin:0 0 12px;">Ha valamit kiegészítenél, egyszerűen válaszolj erre a levélre.</p>
<p style="margin:0;">Üdvözlettel:<br>CicaŐr</p>
