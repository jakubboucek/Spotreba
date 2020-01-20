<?php

namespace App;

use Tracy\Debugger;
use Tracy\ILogger;
use App\Storage\Storage;

// ===== Autoloader knihoven a start Laděnky ====
    require __DIR__ . '/vendor/autoload.php';
    Debugger::enable(Debugger::DETECT, __DIR__ . '/log');
    (new \Nette\Loaders\RobotLoader)->addDirectory(__DIR__ . '/libs')
        ->setTempDirectory(__DIR__ . '/temp/cache')->register();

// ===== Inicializace ===========================

    $basePath = rtrim(\dirname($_SERVER['SCRIPT_NAME']),'/');
    $requestPath = substr($_SERVER['REQUEST_URI'], \strlen($basePath));


$page = '404';
switch ($requestPath) {
    case "/add" :    $page = 'add'; break;
    case "/tank" :   $page = 'tank'; break;
    case "/create" : $page = 'create'; break;
    case "/show" : $page = 'show'; break;
    case "/" :       $page = 'welcome'; break;
    case preg_match('/change\/.*/i', $requestPath) || preg_match('/change$/i', $requestPath) : $page = 'change'; break;
}


if(Helpers::isFormSent('form-add')){ // odesláno
}
if(Helpers::isFormSent('form-tank')){ // odesláno
}
if(Helpers::isFormSent('form-create')){ // odesláno

    $carname = Helpers::getFormValue('carname');
    $owner = Helpers::getFormValue('owner');
    $user = Helpers::getFormValue('user');
    $km_stav = Helpers::getFormValue('km_stav');

    $car = new Car($carname, $owner, $user, $km_stav);

    echo($car->toArray()['carname']);
}

?>

<? include("page/head.php"); ?>

<body>

<?php include("page/datalists.php"); ?>

<?php include("page/navbar.php"); ?>
<?php include("page/statusbar.php"); ?>

<?php

    switch($page) {
        case 'add': include("forms/add.php"); break;
        case 'tank': include("forms/tank.php"); break;
        case 'create': include("forms/create.php"); break;
        case 'show': include("page/show.php"); break;
        case 'welcome': include("forms/welcome.php"); break;
        default: include("page/404.php"); break;
    }

?>

</body>
