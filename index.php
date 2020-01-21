<?php

namespace App;

use App\Content;
use Tracy\Debugger;
use Tracy\ILogger;
use App\Storage\Storage;
use App\Validator\Validate;
use App\Validator\ValidateException;

// ===== Autoloader knihoven a start Laděnky ====
    require __DIR__ . '/vendor/autoload.php';
    Debugger::enable(Debugger::DETECT, __DIR__ . '/log');
    (new \Nette\Loaders\RobotLoader)->addDirectory(__DIR__ . '/libs')
        ->setTempDirectory(__DIR__ . '/temp/cache')->register();

// ===== Inicializace ===========================

    $basePath = rtrim(\dirname($_SERVER['SCRIPT_NAME']),'/');
    $requestPath = substr($_SERVER['REQUEST_URI'], \strlen($basePath));
    $storage = new Storage(__DIR__ . '/output');


$error = null;
$car = null;
$page = '404';

switch ($requestPath) {
    case "/add" :    $page = 'add'; break;
    case "/tank" :   $page = 'tank'; break;
    case "/create" : $page = 'create'; break;
    case "/show" :   $page = 'show'; break;
    case "/" :       $page = 'welcome'; break;
    case preg_match('/change\/.*/i', $requestPath) || preg_match('/change$/i', $requestPath) : $page = 'change'; break;
}


if(Helpers::isFormSent('form-add')){ // odesláno
}
if(Helpers::isFormSent('form-tank')){ // odesláno
}
if(Helpers::isFormSent('form-change')){ // odesláno

    $carname = preg_replace('/.*?change\//i', "", $requestPath);
    $carKey = null;
    $e = null;

    foreach ($storage->findKeys() as $key) {
        $data = $storage->getByKey($key);
        if (isset($data['carId']) && $data['carId'] == $carname) {
            $carKey = $key;
        }
    }

    $data = $storage->getByKey($key);
    if ($data !== null) {


        try {
            $carWasChanged = false;
            $testCar = new Car(
                new Content\Carname(Helpers::getFormValue('carname')),
                new Content\Name(Helpers::getFormValue('owner')),
                new Content\Name(Helpers::getFormValue('driver')),
                new Content\Km(Helpers::getFormValue('km_stav')),
            ); // test if new values are okay

            $data = [];
            $data['carname'] = Helpers::getFormValue('carname');
            $data['owner'] = Helpers::getFormValue('owner');
            $data['driver'] = Helpers::getFormValue('driver');
            $data['km_stav'] = Helpers::getFormValue('km_stav');
            $data['carId'] = Helpers::getFormValue('carId');

            $storage->changeCar($carKey, $data);
            $carWasChanged = true;

        } catch (ValidateException $e) {
            $error = $e->getMessage();
        } catch (\Exception $e) {
            Debugger::log($e, ILogger::ERROR);
            $error = 'Omlouváme se, něco se pokazilo, zkuste to znovu později nebo nás kontaktujte na support@service.cz';
        }
    }



}
if(Helpers::isFormSent('form-create')){ // odesláno


    $e = null;
    try {

        $car = new Car(
            new Content\Carname(Helpers::getFormValue('carname')),
            new Content\Name(Helpers::getFormValue('owner')),
            new Content\Name(Helpers::getFormValue('driver')),
            new Content\Km(Helpers::getFormValue('km_stav')),
        );

        $storage->createCar($car->getId(), $car->toArray());

    } catch (ValidateException $e) {
        $error = $e->getMessage();
    } catch (\Exception $e) {
        Debugger::log($e, ILogger::ERROR);
        $error = 'Omlouvám se, něco se pokazilo, zkus to znovu.';
    }
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
        case 'welcome': include("page/welcome.php"); break;
        case 'change': include("forms/change.php"); break;
        default: include("page/404.php"); break;
    }

?>

</body>
