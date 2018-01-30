<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>
<div class="bx-subscribe">
    <div class="bx-block-title">Информируем о выгодных спецпредложениях</div>
    <? $APPLICATION->IncludeComponent("bitrix:sender.subscribe", "", array(
        "SET_TITLE" => "N"
    )); ?>
</div>