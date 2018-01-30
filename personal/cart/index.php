<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle("Корзина");
?><? $APPLICATION->IncludeComponent(
    "bitrix:sale.basket.basket",
    ".default",
    array(
        "COUNT_DISCOUNT_4_ALL_QUANTITY" => "N",
        "COLUMNS_LIST" => array(
            0 => "NAME",
            1 => "DISCOUNT",
            2 => "WEIGHT",
            3 => "PROPS",
            4 => "DELETE",
            5 => "DELAY",
            6 => "PRICE",
            7 => "QUANTITY",
            8 => "SUM",
        ),
        "AJAX_MODE" => "N",
        "AJAX_OPTION_JUMP" => "N",
        "AJAX_OPTION_STYLE" => "Y",
        "AJAX_OPTION_HISTORY" => "N",
        "PATH_TO_ORDER" => "/personal/order/make/",
        "HIDE_COUPON" => "N",
        "QUANTITY_FLOAT" => "N",
        "PRICE_VAT_SHOW_VALUE" => "Y",
        "TEMPLATE_THEME" => "site",
        "SET_TITLE" => "Y",
        "AJAX_OPTION_ADDITIONAL" => "",
        "OFFERS_PROPS" => array(
            0 => "ARTNUMBER",
            1 => "COLOR_REF",
            2 => "SIZES_SHOES",
            3 => "SIZES_CLOTHES",
        ),
        "COMPONENT_TEMPLATE" => ".default",
        "USE_PREPAYMENT" => "N",
        "CORRECT_RATIO" => "N",
        "AUTO_CALCULATION" => "Y",
        "ACTION_VARIABLE" => "basketAction",
        "COMPOSITE_FRAME_MODE" => "A",
        "COMPOSITE_FRAME_TYPE" => "AUTO",
        "USE_GIFTS" => "Y",
        "GIFTS_PLACE" => "BOTTOM",
        "GIFTS_BLOCK_TITLE" => "Выберите один из подарков",
        "GIFTS_HIDE_BLOCK_TITLE" => "N",
        "GIFTS_TEXT_LABEL_GIFT" => "Подарок",
        "GIFTS_PRODUCT_QUANTITY_VARIABLE" => "quantity",
        "GIFTS_PRODUCT_PROPS_VARIABLE" => "prop",
        "GIFTS_SHOW_OLD_PRICE" => "Y",
        "GIFTS_SHOW_DISCOUNT_PERCENT" => "Y",
        "GIFTS_SHOW_NAME" => "Y",
        "GIFTS_SHOW_IMAGE" => "Y",
        "GIFTS_MESS_BTN_BUY" => "Выбрать",
        "GIFTS_MESS_BTN_DETAIL" => "Подробнее",
        "GIFTS_PAGE_ELEMENT_COUNT" => "4",
        "GIFTS_CONVERT_CURRENCY" => "Y",
        "GIFTS_HIDE_NOT_AVAILABLE" => "N",
        "USE_ENHANCED_ECOMMERCE" => "N"
    ),
    false
); ?><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>