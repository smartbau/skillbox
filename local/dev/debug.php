<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
pre('start');
$_exchange = new\SoapConnect(SKLBOX_1C_URL, SKLBOX_1C_LOGIN, SKLBOX_1C_PASS);
$wsdl = $_exchange->GetCitiesByCountry();
pre($wdsl);
pre('done');