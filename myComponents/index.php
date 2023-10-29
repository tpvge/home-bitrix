<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Мои компоненты");
?><?$APPLICATION->IncludeComponent(
	"local:addReview", 
	".default", 
	array(
		"ELEMENT_ID" => "18",
		"STARS_COUNT" => "3",
		"USER_BLOCK_FIELD" => "UF_VOTING",
		"COMPONENT_TEMPLATE" => ".default"
	),
	false
);?><?$APPLICATION->IncludeComponent(
	"local:listReview", 
	".default", 
	array(
		"CACHE_TIME" => "36000000",
		"CACHE_TYPE" => "A",
		"DATE_FROM" => "",
		"ELEMENT_ID" => "3",
		"NAVIGATION_TEMPLATE" => ".default",
		"PAGE_ELEMENTS_COUNT" => "",
		"COMPONENT_TEMPLATE" => ".default"
	),
	false
);?><br><?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>