<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>


<h3>Оставить отзыв об элементе</h3>
<!-- Блок для вывода ошибок -->
<div id="errors_output" class="alert alert-danger d-none"></div>

<div id="review_loading">Загрузка...</div>
<? if ($arResult['USER_VOTED'] == 'N') : ?>
    <div id="review_form" class="d-none">
        <input type="hidden" name="ELEMENT_ID" value="<?= $arResult["ELEMENT_ID"] ?>">
        <input type="hidden" name="USER_ID" value="<?= $USER->GetID() ?>">
        <div class="rating-area">
            <? for ($i = $arResult["STARS_COUNT"]; $i > 0; $i--) : ?>
                <input type="radio" id="star-<?= $i ?>" name="rating" checked value=<?= $i ?>>
                <label for="star-<?= $i ?>" title="Оценка <?= $i ?>"></label>
            <? endfor; ?>
        </div>
        <div class="mt-2">
            <div class="font-weight-bold">Текст отзыва</div>
            <textarea name="review_text" id="review_text" rows="10" class="w-50"></textarea>
        </div>
        <button <?= $arResult['USER_VOTED'] == 'Y' ? "disabled" : "" ?> class="btn" style="background-color:blue; color: white" id="save" data-element="<?= $arResult['IBLOCK_ELEMENT_ID'] ?>">Сохранить</button>
    </div>
<? else : ?>
    <h4>Вы уже голосовали</h4>
<? endif; ?>
<script>
    window.onload = () => reviewActions(<?= json_encode($arResult, JSON_UNESCAPED_UNICODE) ?>);
</script>