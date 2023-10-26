<?php
/*
 * Файл bitrix/components/demo/catalog.element/templates/.default/template.php
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();
?>

<h1><?= $arResult['GENERAL']['NAME']; ?></h1>

<?php if (!empty($arResult['GENERAL']['DETAIL_TEXT'])): ?>
    <div class="description">
    <?= $arResult['GENERAL']['DETAIL_TEXT']; ?>   
    </div>
<?php endif; ?>

<?php if (!empty($arResult['GENERAL']['DETAIL_PICTURE'])): ?>
    <?php $image = CFile::GetPath($arResult['GENERAL']['DETAIL_PICTURE']); ?>
    <img src="<?= $image; ?>" alt="" />
<?php endif; ?>