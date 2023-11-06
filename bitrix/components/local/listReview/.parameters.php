<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
CModule::IncludeModule("iblock");
$arSelect = [
    "ID",
    "NAME",
    "IBLOCK_ID"
];
$arFilter = [
    "IBLOCK_ID" => 2,
    "ACTIVE_DATE" => "Y",
    "ACTIVE" => "Y",
];

$dbIBlockType = CIBlockElement::GetList([], $arFilter, false, false, $arSelect);
while ($arIBlockType = $dbIBlockType->Fetch()) {
    $arIblockType[$arIBlockType["ID"]] = "ID: " . $arIBlockType["ID"] . " -> " . "NAME: " . $arIBlockType["NAME"];
}

$arTemplates = array();
$rsTemplates = CComponentUtil::GetTemplatesList("bitrix:main.pagenavigation");
foreach ($rsTemplates as $key => $value) {
    $arTemplates[$key] = $value["NAME"];
}

$arComponentParameters  = [
    "PARAMETERS" => [
        'ELEMENT_ID' => [
            'PARENT' => 'BASE',
            'NAME' => 'ID элемента инфоблока',
            'TYPE' => 'LIST',
            'MULTIPLE' => 'N',
            'VALUES' => $arIblockType,
        ],
        'DATE_FROM' => [
            'PARENT' => 'BASE',
            'NAME' => 'Дата, с которой нужно выводить отзывы',
            'TYPE' => 'DATE'
        ],
        'PAGE_ELEMENTS_COUNT' => [
            'PARENT' => 'VISUAL',
            'NAME' => 'Количество отзывов на странице',
            'TYPE' => 'STRING',
        ],
        'NAVIGATION_TEMPLATE' => [
            'PARENT' => 'VISUAL',
            'NAME' => 'Название шаблона пагинатора',
            'TYPE' => 'LIST',
            'VALUES' => $arTemplates,
            'DEFAULT' => '.default'
        ],
        'CACHE_TIME' => [
            'PARENT' => 'CACHE_SETTINGS',
            'NAME' => 'Время кеширования',
            'TYPE' => 'STRING',
            "DEFAULT" => 36000000
        ]
    ]
];
