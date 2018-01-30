<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("tags", "склад строительных материалов");
$APPLICATION->SetPageProperty("keywords_inner", "склад строительных материалов");
$APPLICATION->SetPageProperty("title", "Склад профессиональных немецких строительных материалов quick-mix");
$APPLICATION->SetPageProperty("keywords", "завод строительных материалов, производство строительных материалов, склад строительных материалов, где купить строительные материалы");
$APPLICATION->SetPageProperty("description", "Контактная и логистическая информация о складах профессиональных немецких строительных материалов quick-mix");
$APPLICATION->SetTitle("Склады");
?><? $APPLICATION->IncludeComponent(
    "bitrix:catalog.store",
    "",
    Array(
        "SEF_MODE" => "Y",
        "PHONE" => "N",
        "SCHEDULE" => "N",
        "SET_TITLE" => "Y",
        "TITLE" => "Список складов quick-mix",
        "MAP_TYPE" => "0",
        "CACHE_TYPE" => "A",
        "CACHE_TIME" => "3600",
        "CACHE_NOTES" => "",
        "SEF_FOLDER" => "/store/",
        "SEF_URL_TEMPLATES" => Array(
            "liststores" => "index.php",
            "element" => "#store_id#"
        ),
        "VARIABLE_ALIASES" => Array(
            "liststores" => Array(),
            "element" => Array(),
        )
    ),
    false
); ?><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>