<?php
//////////////////////////////////////////////////////////////
////////////// Vlastni trida pro praci s databazi ////////////////
//////////////////////////////////////////////////////////////

/**
 * Vlastni trida spravujici databazi.
 */
class MyDatabase
{

    /** @var PDO $pdo  PDO objekt pro praci s databazi. */
    private $pdo;

    /**
     * MyDatabase constructor.
     * Inicializace pripojeni k databazi a pokud ma byt spravovano prihlaseni uzivatele,
     * tak i vlastni objekt pro spravu session.
     * Pozn.: v samostatne praci by sprava prihlaseni uzivatele mela byt v samostatne tride.
     * Pozn.2: take je mozne do samostatne tridy vytahnout konkretni funkce pro praci s databazi.
     */
    public function __construct()
    {
        // inicialilzuju pripojeni k databazi - informace beru ze settings
        $this->pdo = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $this->pdo->exec("set names utf8");
        // nastavení PDO error módu na výjimku, tj. každá chyba při práci s PDO bude výjimkou
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }


    ///////////////////  Obecne funkce  ////////////////////////////////////////////

    /**
     *  Provede dotaz a bud vrati ziskana data, nebo pri chybe ji vypise a vrati null.
     *  Varianta, pokud je pouzit PDO::ERRMODE_EXCEPTION
     *
     *  @param string $dotaz        SQL dotaz.
     *  @return PDOStatement|null    Vysledek dotazu.
     */
    private function executeQuery(string $dotaz)
    {
        // vykonam dotaz
        try {
            $res = $this->pdo->query($dotaz);
            return $res;
        } catch (PDOException $ex) {
            echo "Nastala výjimka: " . $ex->getCode() . "<br>"
                . "Text: " . $ex->getMessage();
            return null;
        }
    }

    /**
     * Jednoduche cteni z prislusne DB tabulky.
     *
     * @param string $tableName         Nazev tabulky.
     * @param string $whereStatement    Pripadne omezeni na ziskani radek tabulky. Default "".
     * @param string $orderByStatement  Pripadne razeni ziskanych radek tabulky. Default "".
     * @return array                    Vraci pole ziskanych radek tabulky.
     */
    public function selectFromTable(string $tableName, string $fromStatement = "", string $whereStatement = "", string $orderByStatement = ""): array
    {
        // slozim dotaz
        $q = "SELECT " . (($fromStatement == "") ? '*' : $fromStatement)
            . " FROM " . $tableName
            . (($whereStatement == "") ? "" : " WHERE $whereStatement")
            . (($orderByStatement == "") ? "" : " ORDER BY $orderByStatement");
        // provedu ho a vratim vysledek
        $obj = $this->executeQuery($q);
        // pokud je null, tak vratim prazdne pole
        if ($obj == null) {
            return [];
        }
        // prevedu vsechny ziskane radky tabulky na pole
        return $obj->fetchAll();
    }

    /**
     * Jednoduche vlozeni do prislusne tabulky.
     *
     * @param string $tableName         Nazev tabulky.
     * @param string $insertStatement   Text s nazvy sloupcu pro insert.
     * @param string $insertValues      Text s hodnotami pro prislusne sloupce.
     * @return bool                     Vlozeno v poradku?
     */
    public function insertIntoTable(string $tableName, string $insertStatement, string $insertValues): bool
    {
        // slozim dotaz
        $q = "INSERT INTO $tableName($insertStatement) VALUES ($insertValues)";
        // provedu ho a vratim uspesnost vlozeni
        $obj = $this->executeQuery($q);
        // pokud ($obj == null), tak vratim false
        return ($obj != null);
    }

    /**
     * Jednoducha uprava radku databazove tabulky.
     *
     * @param string $tableName                     Nazev tabulky.
     * @param string $updateStatementWithValues     Cela cast updatu s hodnotami.
     * @param string $whereStatement                Cela cast pro WHERE.
     * @return bool                                 Upraveno v poradku?
     */
    public function updateInTable(string $tableName, string $updateStatementWithValues, string $whereStatement): bool
    {
        // slozim dotaz
        $q = "UPDATE `$tableName` SET $updateStatementWithValues WHERE $whereStatement";
        // provedu ho a vratim vysledek
        $obj = $this->executeQuery($q);
        // pokud ($obj == null), tak vratim false
        return ($obj != null);
    }

    /**
     * Dle zadane podminky maze radky v prislusne tabulce.
     *
     * @param string $tableName         Nazev tabulky.
     * @param string $whereStatement    Podminka mazani.
     * @return bool
     */
    public function deleteFromTable(string $tableName, string $whereStatement): bool
    {
        // slozim dotaz
        $q = "DELETE FROM $tableName WHERE $whereStatement";
        // provedu ho a vratim vysledek
        $obj = $this->executeQuery($q);
        // pokud ($obj == null), tak vratim false
        return ($obj != null);
    }

    /**
     * Spoji 2 pole do jednoho dle predaneho id
     * 
     * @param $array1 Prvni pole
     * @param $array2 Druhe pole
     * @param $idField Podle ceho to ma byt spojovano
     */
    public function mergeArrays($array1, $array2, $idField)
    {
        $mergedArray = array();

        foreach ($array1 as $item) {
            $id = $item[$idField];
            $mergedArray[$id] = $item;
        }

        foreach ($array2 as $item) {
            $id = $item[$idField];
            if (array_key_exists($id, $mergedArray)) {
                // Merge the data based on the common id
                $mergedArray[$id] = array_merge($mergedArray[$id], $item);
            } else {
                continue;
            }
        }

        return array_values($mergedArray);
    }


    ///////////////////  KONEC: Obecne funkce  ////////////////////////////////////////////

    ///////////////////  Konkretni funkce  ////////////////////////////////////////////

    /**
     * Ziskani zaznamu vsech uzivatelu aplikace.
     *
     * @return array    Pole se vsemi uzivateli.
     */
    public function getAllUsers()
    {
        // ziskam vsechny uzivatele z DB razene dle ID a vratim je
        $fromStatement = "osoba_id, jmeno, prijmeni, prezdivka, heslo, telefon, email, role_id";
        return $this->selectFromTable(TABLE_UZIVATEL, $fromStatement);
    }

    public function getAllRoles() {
        return $this->selectFromTable(TABLE_ROLE);
    }

    public function getUser($osoba_id) {
        // ziskam vsechny uzivatele z DB razene dle ID a vratim je
        $fromStatement = "osoba_id, jmeno, prijmeni, prezdivka, heslo, telefon, email, role_id";
        $whereStatement = "`osoba`.`osoba_id`=$osoba_id";
        return $this->selectFromTable(TABLE_UZIVATEL, $fromStatement, $whereStatement);
    }

    public function getUserNickAndPwd($prezdivka, $heslo){
        $fromStatement = "osoba_id, jmeno, prijmeni, prezdivka, heslo, telefon, email, role_id";
        $whereStatement = "`osoba`.`prezdivka`='$prezdivka' AND `osoba`.`heslo`='$heslo'";
        return $this->selectFromTable(TABLE_UZIVATEL, $fromStatement, $whereStatement);
    }

    /**
     * Ziskani zaznamu vsech podrobnosti her.
     *
     * @return array    Pole se vsemi podrobnostmi.
     */
    public function getAllGamesDetails()
    {
        $fromStatement = "polozka_id, vek_hracu, pocet_hracu, delka_hry, prehled_komponent, odkaz_web_herni";
        return $this->selectFromTable(TABLE_HRA_DETAIL, $fromStatement);
    }

    public function getAllUserBorrows($id) {
        $fromStatement = "vypujcka_id, polozka_id, objednava_osoba_id, resi_osoba_id, stav_id, dat_zapujceni,
        dat_navraceni_plan, dat_navraceni, cena_zalohy, cena_vypujcky";
        $whereStatement = "`vypujcka`.`objednava_osoba_id`=$id";
        return $this->selectFromTable(TABLE_VYPUJCKA, $fromStatement, $whereStatement);
    }

    public function getAllBorrows() {
        $fromStatement = "vypujcka_id, polozka_id, objednava_osoba_id, resi_osoba_id, stav_id, dat_zapujceni,
        dat_navraceni_plan, dat_navraceni, cena_zalohy, cena_vypujcky";
        return $this->selectFromTable(TABLE_VYPUJCKA, $fromStatement);
    }

    public function getBorrowsBasicInfo() {
        $fromStatement = "polozka_id, dat_zapujceni, dat_navraceni_plan";
        $whereStatement = "`vypujcka`.`stav_id`=1 OR `vypujcka`.`stav_id`=2 OR `vypujcka`.`stav_id`=3";
        return $this->selectFromTable(TABLE_VYPUJCKA, $fromStatement, $whereStatement);
    }

    public function getAllStates() {
        $fromStatement = "stav_id, nazev_stavu";
        return $this->selectFromTable(TABLE_STAV, $fromStatement);
    }
    
    /**
     * Ziskani zaznamu vsech her
     * 
     * @return array Pole se vsemi hrami
     */
    public function getAllGames()
    {
        $fromStatement = "polozka_id, titul_polozky, kratky_popis, popis, seo_url, pujcovna_zaloha, pujcovne_id";
        $whereStatement = "typ_pol_id=1 AND aktivni='A'";
        return $this->selectFromTable(TABLE_HRA, $fromStatement, $whereStatement);
    }

    /**
     * Ziskani seznamu kombinaci pujcovneho
     * 
     * @return array Pole se vsemi kombinacemi pujcovneho
     */
    public function getAllRents()
    {
        return $this->selectFromTable(TABLE_PUJCOVNE);
    }

    /**
     * Ziskani seznamu kategorii
     * 
     * @return array Pole se vsemi kombinacemi pujcovneho
     */
    public function getAllCategories()
    {
        $fromStatement = "kategorie_id, popis_kategorie, seo_popis";
        return $this->selectFromTable(TABLE_KATEGORIE, $fromStatement);
    }

    /**
     * Vytvoreni noveho uzivatele v databazi.
     *
     * @param string $login     Login.
     * @param string $jmeno     Jmeno.
     * @param string $email     E-mail.
     * @param int $idPravo      Je cizim klicem do tabulky s pravy.
     * @return bool             Vlozen v poradku?
     */
    public function addNewUser(string $jmeno, string $prijmeni, string $prezdivka, string $telefon, string $email, string $heslo, int $role_id)
    {
        // hlavicka pro vlozeni do tabulky uzivatelu
        $insertStatement = "jmeno, prijmeni, prezdivka, telefon, email, heslo, role_id";
        // hodnoty pro vlozeni do tabulky uzivatelu
        $insertValues = "'$jmeno', '$prijmeni', '$prezdivka', '$telefon', '$email', '$heslo', $role_id";
        // provedu dotaz a vratim jeho vysledek
        return $this->insertIntoTable(TABLE_UZIVATEL, $insertStatement, $insertValues);
    }

    public function addNewBorrow(int $polozka_id, int $objednava_osoba_id, int $stav_id, string $dat_zapujceni,
    string $dat_navraceni_plan, int $cena_zalohy, int $cena_vypujcky) {
        $insertStatement = "polozka_id, objednava_osoba_id, stav_id, dat_zapujceni, dat_navraceni_plan,
        cena_zalohy, cena_vypujcky";
        $insertValues = "'$polozka_id', '$objednava_osoba_id', '$stav_id', '$dat_zapujceni',
        '$dat_navraceni_plan', '$cena_zalohy', $cena_vypujcky";
        return $this->insertIntoTable(TABLE_VYPUJCKA, $insertStatement, $insertValues);
    }

    
    public function updateUser(int $osoba_id, string $jmeno, string $prijmeni, string $prezdivka, string $telefon, string $email, string $heslo, int $role_id)
    {
        // slozim cast s hodnotami
        $updateStatementWithValues = "`jmeno`='$jmeno', `prijmeni`='$prijmeni', `prezdivka`='$prezdivka', `telefon`='$telefon', `email`='$email',
         `heslo`='$heslo', `role_id`='$role_id'";
        // podminka
        $whereStatement = "`osoba`.`osoba_id`=$osoba_id";
        // provedu update
        return $this->updateInTable(TABLE_UZIVATEL, $updateStatementWithValues, $whereStatement);
    }

    public function updateBorrow(int $vypujcka_id, int $resi_osoba_id, int $stav_id, string $dat_zapujceni, string $dat_navraceni_plan) {
        $updateStatementWithValues = "`stav_id`=$stav_id, `resi_osoba_id`='$resi_osoba_id', `dat_zapujceni`='$dat_zapujceni', `dat_navraceni_plan`='$dat_navraceni_plan'";
        $whereStatement = "`vypujcka`.`vypujcka_id`=$vypujcka_id";
        return $this->updateInTable(TABLE_VYPUJCKA, $updateStatementWithValues, $whereStatement);
    }

    ///////////////////  KONEC: Konkretni funkce  ////////////////////////////////////////////

}
