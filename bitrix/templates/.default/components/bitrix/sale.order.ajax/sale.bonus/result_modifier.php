<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
{
	die();
}

/**
 * @var array $arParams
 * @var array $arResult
 * @var SaleOrderAjax $component
 */

$arParams['SERVICES_IMAGES_SCALING'] = (string)($arParams['SERVICES_IMAGES_SCALING'] ?? 'adaptive');

$component = $this->__component;
$component::scaleImages($arResult['JS_DATA'], $arParams['SERVICES_IMAGES_SCALING']);

// $rsUsers = CUser::GetByID($USER->GetID());
// $arUser = $rsUsers->Fetch();
// $arResult['JS_DATA']["USER"]["BONUS"] = $arUser["UF_BONUS"];
// $arResult['JS_DATA']["USER"]["SECOND_NAME"] = $arUser["SECOND_NAME"];
// $arResult['JS_DATA']["USER"]["PAYER_TYPE"] = $arUser["UF_PAYER_TYPE"];



