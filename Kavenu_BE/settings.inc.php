<?php
///////////////////////////////////////////////////////
////////////// Zakladni nastaveni webu ////////////////
///////////////////////////////////////////////////////

////// nastaveni pristupu k databazi ///////

    // prihlasovaci udaje k databazi
    define("DB_SERVER","localhost");
    define("DB_NAME","kavenu");
    define("DB_USER","root");
    define("DB_PASS","");

    // definice konkretnich nazvu tabulek
    define("TABLE_HRA", "polozka");
    define("TABLE_HRA_DETAIL","polozka_hra");
    define("TABLE_PUJCOVNE","polozka_pujcovne");
    define("TABLE_KATEGORIE","kategorie");
    define("TABLE_UZIVATEL","osoba");
    define("TABLE_ROLE","role");
    define("TABLE_VYPUJCKA","vypujcka");
    define("TABLE_STAV","stav");

    ///// vsechny stranky webu ////////

    // pripona souboru
    $phpExtension = ".inc.php";

    // dostupne stranky webu
    define("WEB_PAGES", [
        'test' => "test".$phpExtension,
        'rest_api' => "rest_api".$phpExtension
    ]);

    // defaultni/vychozi stranka webu
    define("WEB_PAGE_DEFAULT_KEY", 'rest_api');
?>