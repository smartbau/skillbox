<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<? $APPLICATION->IncludeComponent("bitrix:eshop.socnet.links", "big_squares_qm", Array(
    "FACEBOOK" => "https://www.facebook.com/smartbau.ru",    // Ссылку на страницу в Facebook
    "VKONTAKTE" => "https://vk.com/smartbaugmbh",    // Ссылку на страницу в Vkontakte
    "TWITTER" => "https://twitter.com/SmartBau",    // Ссылку на страницу в Twitter
    "GOOGLE" => "https://plus.google.com/+SmartBauRu",    // Ссылку на страницу в Google
    "INSTAGRAM" => "https://www.instagram.com/smartbaugmbh/",    // Ссылку на страницу в Instagram
    "COMPONENT_TEMPLATE" => "big_squares",
    "COMPOSITE_FRAME_MODE" => "A",    // Голосование шаблона компонента по умолчанию
    "COMPOSITE_FRAME_TYPE" => "AUTO",    // Содержимое компонента
),
    false,
    array(
        "HIDE_ICONS" => "N"
    )
); ?>