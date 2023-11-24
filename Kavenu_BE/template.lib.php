<?php
function createGameTemplate($dbData)
{
    $jsonData = array();
    foreach ($dbData as $data) {
        $jsonData[] = array(
            'polozka_id' => $data['polozka_id'],
            'titul_polozky' => $data['titul_polozky'],
            'kratky_popis' => $data['kratky_popis'],
            'popis' => $data['popis'],
            'pujcovna_zaloha' => $data['pujcovna_zaloha'],
            'seo_url' => $data['seo_url'],
            'pujcovne_id' => $data['pujcovne_id'],
            'vek_hracu' => $data['vek_hracu'],
            'pocet_hracu' => $data['pocet_hracu'],
            'delka_hry' => $data['delka_hry'],
            'prehled_komponent' => $data['prehled_komponent'],
            'odkaz_web_herni' => $data['odkaz_web_herni']
        );
    }
    
    return $jsonData;
}

function createGameRentTemplate($dbData)
{
    $jsonData = array();
    foreach ($dbData as $data) {
        $jsonData[] = array(
            'pujcovne_id' => $data['pujcovne_id'],
            'pujcovne_pidi' => $data['pujcovne_pidi'],
            'pujcovne_medi' => $data['pujcovne_medi'],
            'pujcovne_maxi' => $data['pujcovne_maxi']
        );
    }
    
    return $jsonData;
}

function createUserTemplate($dbData) {
    $jsonData = array();
    foreach ($dbData as $data) {
        $jsonData[] = array(
            'osoba_id' => $data['osoba_id'],
            'jmeno' => $data['jmeno'],
            'prijmeni' => $data['prijmeni'],
            'prezdivka' => $data['prezdivka'],
            'telefon' => $data['telefon'],
            'email' => $data['email'],
            'heslo' => $data['heslo'],
            'role_id' => $data['role_id']
        );
    }
    
    return $jsonData;
}

function createRoleTemplate($dbData) {
    $jsonData = array();
    foreach ($dbData as $data) {
        $jsonData[] = array(
            'role_id' => $data['role_id'],
            'popis_role' => $data['popis_role']
        );
    }

    return $jsonData;
}

function createBorrowsTemplate($dbData) {
    $jsonData = array();
    foreach ($dbData as $data) {
        $jsonData[] = array(
            'vypujcka_id' => $data['vypujcka_id'],
            'polozka_id' => $data['polozka_id'],
            'objednava_osoba_id' => $data['objednava_osoba_id'],
            'resi_osoba_id' => $data['resi_osoba_id'],
            'stav_id' => $data['stav_id'],
            'dat_zapujceni' => $data['dat_zapujceni'],
            'dat_navraceni' => $data['dat_navraceni_plan'],
            'dat_vraceno' => $data['dat_navraceni'],
            'cena_zalohy' => $data['cena_zalohy'],
            'cena_vypujcky' => $data['cena_vypujcky']
        );
    }
    return $jsonData;
}

function createBorrowsBasicInfoTemplate($dbData) {
    $jsonData = array();
    foreach ($dbData as $data) {
        $jsonData[] = array(
            'polozka_id' => $data['polozka_id'],
            'dat_zapujceni' => $data['dat_zapujceni'],
            'dat_navraceni' => $data['dat_navraceni_plan']
        );
    }
    return $jsonData;
}

function createStatesTemplate($dbData) {
    $jsonData = array();
    foreach ($dbData as $data) {
        $jsonData[] = array(
            'stav_id' => $data['stav_id'],
            'nazev_stavu' => $data['nazev_stavu']
        );
    }
    return $jsonData;
}


function createCategoryTemplate($dbData)
{
    $jsonData = array();
    foreach ($dbData as $data) {
        $jsonData[] = array(
            'kategorie_id' => $data['kategorie_id'],
            'popis_kategorie' => $data['popis_kategorie'],
            'seo_popis' => $data['seo_popis']
        );
    }

    return $jsonData;
}
?>