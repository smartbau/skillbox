<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>
<?
$APPLICATION->IncludeComponent("bitrix:eshop.facebook.plugin", "",
    array(
        "ESHOP_FACEBOOK_LINK" => "https://www.facebook.com/smartbau.ru"
    ),
    false
);
?>