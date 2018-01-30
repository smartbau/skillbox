<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle("Задайте вопрос");
?>
    <div class="row">
    <div class="col-xs-12">
        <p>
            <b>Телефон:</b> 8 800 250-78-87<br>
            <b>Адрес:</b> Калужская обл., г. Калуга, ул. Гагарина, дом 8а
        </p>
        <script type="text/javascript" charset="utf-8" async
                src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A9bad36b004d4f248b916c9a80702e6ab293bd11c119f5da32605c80d38ad5887&amp;width=100%25&amp;height=490&amp;lang=ru_RU&amp;scroll=true"></script>
        <h2>Задать вопрос</h2>
        <? $APPLICATION->IncludeComponent(
            "bitrix:main.feedback",
            "eshop",
            Array(
                "EMAIL_TO" => "info@quickmix.pro",
                "EVENT_MESSAGE_ID" => array(),
                "OK_TEXT" => "Спасибо, ваше сообщение принято.",
                "REQUIRED_FIELDS" => array(),
                "USE_CAPTCHA" => "Y"
            )
        ); ?>
    </div>
    </div><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php") ?>