<?

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>

<h3 class="mt-5">Список отзывов об элементе</h3>

<?
echo "<pre>";
var_dump($arResult);
echo "</pre>";
if ($arResult['REVIEWS_LIST']) {
    foreach ($arResult['REVIEWS_LIST'] as $review) : ?>
        <div class="border p-3 mb-3" <?= $review['AUTHOR_BANNED'] == "1" ? 'style="opacity: 30%"' : '' ?>>
            <div class="d-flex">
                <div>
                    <?= $review['AUTHOR_FULLNAME'] ?>
                </div>
                <div class="ml-3" style="opacity: 50%;">
                    <?= $review['DATE_TIME'] ?>
                </div>
            </div>
            <div style="color:gold; font-size:30px;">
                <? for ($i = 0; $i < $review['VALUE']; $i++) : ?>
                    ★
                <? endfor; ?>
            </div>
            <div>
                <?= $review['TEXT'] ?>
            </div>
        </div>
<? endforeach;
} else {
    echo '<h6>Никто еще не оставлял отзывы к этому элементу</h6>';
} ?>

<?
if ($arResult['NAV_OBJECT'] != false) {
    $APPLICATION->IncludeComponent(
        "bitrix:main.pagenavigation",
        "",
        array(
            "NAV_OBJECT" => $arResult['NAV_OBJECT'],
            "SEF_MODE" => "N",
        ),
        false
    );
}
?>