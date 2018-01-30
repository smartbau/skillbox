<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<? $APPLICATION->IncludeComponent(
    "bitrix:eshop.socnet.links",
    "template_qm",
    array(
        "COMPONENT_TEMPLATE" => "template_qm",
        "FACEBOOK" => "https://www.facebook.com/smartbau.ru",
        "VKONTAKTE" => "https://vk.com/smartbaugmbh",
        "TWITTER" => "https://twitter.com/SmartBau",
        "GOOGLE" => "https://plus.google.com/+SmartBauRu",
        "INSTAGRAM" => "https://instagram.com/smartbaugmbh/",
        "COMPOSITE_FRAME_MODE" => "A",
        "COMPOSITE_FRAME_TYPE" => "AUTO"
    ),
    false,
    array(
        "HIDE_ICONS" => "N"
    )
); ?>