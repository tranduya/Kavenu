<?php
// ---- Povolení CORS
// Enable CORS for all domains (*); you can restrict this to specific domains as needed.
header("Access-Control-Allow-Origin: *");
// Allow the POST method.
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// Allow specific headers. You can adjust this based on your needs.
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Access-Control-Allow-Headers: *");
header("Referrer-Policy: origin");
// Check if it's a preflight OPTIONS request and respond accordingly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Max-Age: 3600");
    header("Content-Length: 0");
    header("Content-Type: text/plain");
    exit;
}

// --- Zpracovní požadavku
// Check for the incoming request method (POST).
if (in_array($_SERVER["REQUEST_METHOD"], ["GET", "POST", "PUT", "DELETE"])) {
    // hlavicka odpovedi
    header('Content-Type: application/json; charset=utf-8');
    require_once("settings.inc.php");
    require_once("MyDatabase.class.php");
    require_once("template.lib.php");
    $myDB = new MyDatabase();
    
    // metoda
    $method = $_SERVER['REQUEST_METHOD'];
    // Get the path
    $path = $_SERVER['REQUEST_URI'];
    $parts = explode("/", $path);
    $keyName = $parts[3];
    $userId = -1;
    $userPwd = '';
    if (count($parts) >= 5) {
        $userId = $parts[4];
    }
    
    if (count($parts) == 6) {
        $userPwd = $parts[5];
    }

    // Get the JSON data from the request body
    $json_data = file_get_contents('php://input');
    
    //////////////////////////////////////////////

    
    $data = array();
    if ($method === 'GET') {
        $data = specifyDataType($keyName, $userId, $myDB, $userPwd);

        if (count($data) == 0) {
            http_response_code(401);
        }
        echo json_encode($data);
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        addToDatabase($keyName, $data, $myDB);
    } elseif ($method === 'PUT') {
        $userId = json_decode(file_get_contents("php://input"));
        updateDatabase($keyName, $userId, $myDB);
    } elseif ($method === 'DELETE') {
        $data = $parts[4];
        deleteFromDatabase($keyName, $data, $myDB);
    } else {
        http_response_code(405); // Method Not Allowed
        echo json_encode(["message" => "Method not allowed"]);
    }
} else {
    // Handle other request methods or provide an error response.
    http_response_code(405); // Method Not Allowed
    echo "Method Not Allowed";
}


/*---------------------GET functions---------------------- */
function specifyDataType($keyName, $userId, $db, $userPwd)
{
    $resultData = array();
    if ($keyName == 'games') {
        $games = $db->mergeArrays($db->getAllGames(), $db->getAllGamesDetails(), 'polozka_id');
        $resultData = createGameTemplate($games);
    } else if ($keyName == 'gameRents') {
        $rents = $db->getAllRents();
        $resultData = createGameRentTemplate($rents);
    } else if ($keyName == 'category') {
        $categories = $db->getAllCategories();
        $resultData = createCategoryTemplate($categories);
    } else if ($keyName == 'users') {
        $users = $db->getAllUsers();
        $resultData = createUserTemplate($users);
    } else if ($keyName == 'user') {
        $user = $db->getUser($userId);
        $resultData = createUserTemplate($user);
    } elseif ($keyName == 'roles') {
        $roles = $db->getAllRoles();
        $resultData = createRoleTemplate($roles);
    } elseif ($keyName == 'auth') {
        $user = $db->getUserNickAndPwd($userId, $userPwd);
        $resultData = createUserTemplate($user);
    } else if ($keyName == 'borrows') {
        $vypujcky = $db->getAllUserBorrows($userId);
        $resultData = createBorrowsTemplate($vypujcky);
    } else if ($keyName == 'allBorrows') {
        $vypujcky = $db->getAllBorrows();
        $resultData = createBorrowsTemplate($vypujcky);
    } else if ($keyName == 'borrowsBasicInfo') {
        $vypujcky = $db->getBorrowsBasicInfo();
        $resultData = createBorrowsBasicInfoTemplate($vypujcky);
    } else if ($keyName == 'states') {
        $states = $db->getAllStates();
        $resultData = createStatesTemplate($states);
    }
    
    return $resultData;
}


/*---------------------POST functions---------------------- */
function addToDatabase($keyName, $data, $db) {
    if ($keyName == 'users') {
        addUser($data, $db);
    } else if ($keyName == 'borrows') {
        addBorrow($data, $db);
    }
}

function addUser($data, $db) {
    $jmeno = $data->jmeno;
    $prijmeni = $data->prijmeni;
    $prezdivka = $data->prezdivka;
    $telefon = $data->telefon;
    $email = $data->email;
    $heslo = $data->heslo;
    $role_id = $data->role_id;
    
    $db->addNewUser($jmeno, $prijmeni, $prezdivka, $telefon, $email, $heslo, $role_id);
}

function addBorrow($data, $db) {
    $polozka_id = $data->polozka_id;
    $objednava_osoba_id = $data->objednava_osoba_id;
    $stav_id = $data->stav_id;
    $dat_zapujceni = $data->dat_zapujceni;
    $dat_navraceni_plan = $data->dat_navraceni;
    $cena_zalohy = $data->cena_zalohy;
    $cena_vypujcky = $data->cena_vypujcky;
    
    $db->addNewBorrow($polozka_id,$objednava_osoba_id, $stav_id, $dat_zapujceni, $dat_navraceni_plan,
    $cena_zalohy, $cena_vypujcky);
}

/*---------------------PUT functions---------------------- */
function updateDatabase($keyName, $data, $db) {
    if ($keyName == 'users') {
        updateUser($data, $db);
    } elseif ($keyName == 'borrows') {
        updateBorrow($data, $db);
    }
}

function updateBorrow($data, $db) {
    $vypujcka_id = $data->vypujcka_id;
    $resi_osoba_id = $data->resi_osoba_id;
    $stav_id = $data->stav_id;
    $dat_zapujceni = $data->dat_zapujceni;
    $dat_navraceni_plan = $data->dat_navraceni;

    $db->updateBorrow($vypujcka_id, $resi_osoba_id, $stav_id, $dat_zapujceni, $dat_navraceni_plan);
}

function updateUser($data, $db) {
    $osoba_id = $data->osoba_id;
    $jmeno = $data->jmeno;
    $prijmeni = $data->prijmeni;
    $prezdivka = $data->prezdivka;
    $telefon = $data->telefon;
    $email = $data->email;
    $heslo = $data->heslo;
    $role_id = $data->role_id;
    
    $db->updateUser($osoba_id, $jmeno, $prijmeni, $prezdivka, $telefon, $email, $heslo, $role_id);
}

/*---------------------DELETE functions---------------------- */
function deleteFromDatabase ($keyName, $userId, $db) {
    if ($keyName == 'users') {
        $db->deleteFromTable(TABLE_UZIVATEL, "`osoba`.`osoba_id`='$userId'");
    }
}