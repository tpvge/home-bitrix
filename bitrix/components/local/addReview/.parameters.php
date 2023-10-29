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




$obEntities = CUserTypeEntity::GetList([], ['ENTITY_ID' => 'USER']);

$arEntities = [];

while ($arEntity = $obEntities->GetNext()) {
    $arEntities[$arEntity["FIELD_NAME"]] = $arEntity["FIELD_NAME"];
}

$arStarsValues = [];

for ($i = 3; $i <= 10; $i++) {
    $arStarsValues[$i] = $i;
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
        'STARS_COUNT' => [
            'PARENT' => 'BASE',
            'NAME' => 'Количество звезд для вывода голосования',
            'TYPE' => 'LIST',
            'MULTIPLE' => 'N',
            'VALUES' => $arStarsValues,
        ],
        'USER_BLOCK_FIELD' => [
            'PARENT' => 'BASE',
            'NAME' => 'Название пользовательского поля, которое отвечает за запрет голосования',
            'TYPE' => 'LIST',
            "MULTIPLE" => "N",
            'VALUES' => $arEntities,
        ],
    ]
];
