<?
namespace Orm\Review;
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();


$isVotingBannedFieldName = (string)$arParams["USER_BLOCK_FIELD"];


if ($USER->GetID() == 0) {
    $arResult['USER_AUTHORIZED'] = 'N';
} else {
    $arResult["VOTING_BANNED"] = 0;
	$arResult['USER_AUTHORIZED'] = 'Y';

	if (strlen(trim($isVotingBannedFieldName)) > 0) {
        $arUser = $USER->GetById($USER->GetID())->Fetch();
        $arResult["VOTING_BANNED"] = $arUser[$isVotingBannedFieldName] == false ? 0 : $arUser[$isVotingBannedFieldName];
	}

	$arReview = RatingEntityTable::getList(
		[
			'select' => ['*'],
			'filter' => [
				'=USER_ID' => $USER->GetID(),   
				'=ELEMENT_ID' => $arParams['ELEMENT_ID']
			]
		]
	)->fetch();


	$arResult['USER_VOTED'] = $arReview != false ? 'Y' : 'N';
	$arResult['VALUE'] = $arReview["VALUE"];
	$arResult['COMMENT'] = $arReview['TEXT'];
	$arResult['IBLOCK_ELEMENT_ID'] = $arParams['ELEMENT_ID'];
	echo "<pre>";
	var_dump($arParams);
	echo "</pre>";
}	

$this->includeComponentTemplate();
