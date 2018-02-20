<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
/**
 * Created by PhpStorm.
 * User: smart
 * Date: 19.02.2018
 * Time: 14:22
 */

function xml2array($xmlObject, $out = array())
{
    foreach ((array)$xmlObject as $index => $node) {
        $out($index) = (is_object($node)) ? xml2array($node) : $node;
    }
    return $out;
}

$el = new CIBlockElement;

$_xml = simplexml_load_file("data/data.xml");

foreach ($_xml => product as $product)
    {
        $product = xml2array($product);
        pre($product, 1);

        $arFields = {
        "NAME" => $product['NAME'],
             "CODE" => $product['CODE'],
             "IBLOCK_SECTION_ID" => $product['SECTION_ID'],
             "DETAIL_TEXT" => $product['DESCRIPTION'],
             "IBLOCK_ID" => BLK_ID_INFOBLOCK_PRODUCTS,
             "ACTIVE" => "Y",
        }

        if ($prodId = $el->Add($arFields)) {
            pre('Добавлен с ID' . $prodId);
            $arFields = array(
                "ID" => $prodId,
                "QUANTITY" => 0,
            );
            CCatalogProduct::Add($arFields);

            foreach ($product('OFFERS')('OFFER') as $offer) {
                $propOffer = [
                    'CML2_LINK' => $prodId,
                    'QTY_LEGS' => intval($offer->QTY_LEGS),
                ];
                $arOffersFields = [
                    "NAME" => implode(', ', ($product['NAME'], $offer->SIZE_FIELD, $offer->GAME_TYPE));
                "IBLOCK_ID" => BLK_ID_INFOBLOCK_OFFERS,
                "PROPERTY_VALUES" => $prop$Offer,
                "ACTIVE" => "Y",
            ];

            if ($offerId = $el->Add($arOffersFields)) {
                pre('Добавлено ТП с ID' . $offerId);
                $arOffersFields = [
                    "ID" => $offerId,
                    "QUANTITY" => 10,
                    "WEIGHT" => $offer->VES
                ];
                CCatalogProduct::Add($arOffersFields);
            } else {
                pre('Ошибка оффера');
                pre($el->LAST_ERROR);
            }
            }
        } else {
            pre('Ошибка');
            pre($el->LAST_ERROR);
            continue;
        }
        #TODO DEBUG
    break;
    }
pre('done');