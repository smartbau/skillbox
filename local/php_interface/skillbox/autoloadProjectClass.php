<?php

use Bitrix\Main\Loader;

Loader::registerAutoLoadClasses(null, [
    #Класс с NAMESPACE -> файл с классом
    '\Skillbox\Catalog' => '/local/php_interface/html/class/Catalog.php',
]);