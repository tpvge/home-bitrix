<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Application;
use Bitrix\Main\Data\Cache;
use Bitrix\Main\Type\DateTime;
use Bitrix\Main\UI\PageNavigation;
use Orm\Review\RatingEntityTable;

$elementId = (int)$arParams['ELEMENT_ID'];

if (empty($arParams['DATE_FROM'])) {
    $dateTime = new DateTime("01.01.1000");
    $dateTime = $dateTime->toString();
} else {
    $dateTime = $arParams['DATE_FROM'];
}


if (empty((int)$arParams['PAGE_ELEMENTS_COUNT'])) {
    $pageElementsCount = 20;
} else {
    $pageElementsCount = (int)$arParams['PAGE_ELEMENTS_COUNT'];
}

if ($elementId == 0) {
    global $APPLICATION;
    $APPLICATION->ThrowException('Элемент не найден');
    return false;
}

$cache = Cache::createInstance();
$taggedCache = Application::getInstance()->getTaggedCache();

$cachePath = SITE_ID . "/tagged_cache/element_voting_list/";
$cacheTime = $arParams['CACHE_TIME'];
$cacheKey = md5(serialize($arParams));

if ($cache->initCache($cacheTime, $cacheKey, $cachePath)) {
    // echo 'Вывод из кэша';
    $arResult = $cache->getVars();
} else {
    // echo 'Вывод из бд';
    $arResult["REVIEWS_LIST"] = [];

    $pageNavigator = new PageNavigation('nav-reviews');
    $pageNavigator->allowAllRecords(true)->setPageSize($pageElementsCount)->initFromUri();

    $obReviews = RatingEntityTable::getList([
        "select" => ['*'],
        'filter' => [
            'ELEMENT_ID' => $arParams['ELEMENT_ID'],
            '>=DATE_TIME' => $dateTime,
        ],
        'order' => [
            'DATE_TIME' => 'DESC'
        ],
        'count_total' => true,
        'offset' => $pageNavigator->getOffset(),
        'limit' => $pageNavigator->getLimit()
    ]);

    $pageNavigator->setRecordCount($obReviews->getCount());

    $arResult['NAV_OBJECT'] = $obReviews->getCount() > $arParams['PAGE_ELEMENTS_COUNT'] ? $pageNavigator : false;

    while ($arReview = $obReviews->fetch()) {
        $rsUser = CUser::GetByID($arReview['USER_ID']);
        $arUser = $rsUser->Fetch();

        $obDate = new DateTime($arReview['DATE_TIME']);
        $arReview['DATE_TIME'] = $obDate->toString();
        $arReview['AUTHOR_FULLNAME'] = $arUser["NAME"] . " " . $arUser["LAST_NAME"];
        $arReview['AUTHOR_BANNED'] = $arUser["UF_VOTING"];
        $arResult["REVIEWS_LIST"][] = $arReview;
    }

    if ($cache->startDataCache()) {
        $taggedCache->startTagCache($cachePath);
        $taggedCache->registerTag('itc_iblock_vote');
        $taggedCache->endTagCache();
        $cache->endDataCache($arResult);
    }
}

$this->includeComponentTemplate();
