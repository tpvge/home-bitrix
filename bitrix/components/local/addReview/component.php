<?php
/*
 * Файл bitrix/components/demo/catalog.element/component.php
 */
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();

// массив результата работы компонента
$arResult = array();
if (CModule::IncludeModule('iblock')) {
    // получаем из базы данных элемент инфоблока по идентификатору;
    // идентификатор получаем из входных параметров компонента
    $PRODUCT_ID = (int)$arParams['PRODUCT_ID'];
    $result = CIBlockElement::GetByID($PRODUCT_ID);
    if ($product = $result->GetNext()) {
        $arResult['GENERAL'] = $product;
    }
}
// подключаем шаблон компонента
$this->IncludeComponentTemplate();