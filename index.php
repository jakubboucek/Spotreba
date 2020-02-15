<?php

namespace App;

use App\Content;
use Tracy\Debugger;
use Tracy\ILogger;
use App\Storage\Storage;
use App\Uploader\Uploader;
use App\Validator\Validate;
use App\Validator\ValidateException;
use App\Uploader\UploaderException;

// ===== Autoloader knihoven a start Laděnky ====
    require __DIR__ . '/vendor/autoload.php';
    Debugger::enable(Debugger::DETECT, __DIR__ . '/log');
    (new \Nette\Loaders\RobotLoader)->addDirectory(__DIR__ . '/libs')
        ->setTempDirectory(__DIR__ . '/temp/cache')->register();

// ===== Inicializace ===========================

    $googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwgGapAKlSUUiXYsYjyk0jlIGiZtYMnB9yq1mvxrbG3PXvEyWHD/exec';
    $basePath = rtrim(\dirname($_SERVER['SCRIPT_NAME']),'/');
    $requestPath = substr($_SERVER['REQUEST_URI'], \strlen($basePath));
    $storage = new Storage(__DIR__ . '/output');
    $uploader = new Uploader($googleScriptUrl);


$error = null;
$car = null;
$google = null;
$page = '404';

switch ($requestPath) {
    case "/add.php" :    $page = 'add'; break;
    case "/tank.php" :   $page = 'tank'; break;
    case "/create.php" : $page = 'create'; break;
}


if(Helpers::isFormSent('form-add')){ // odesláno

    $addArray = [
        'carname' => Helpers::getFormValue('carname'),
        'odkud' => Helpers::getFormValue('odkud'),
        'pres' => Helpers::getFormValue('pres'),
        'kam' => Helpers::getFormValue('kam'),
        'driver' => Helpers::getFormValue('driver'),
        'km-ujeto' => Helpers::getFormValue('km-ujeto'),
        'km_stav' => Helpers::getFormValue('km_stav'),
        'note' => Helpers::getFormValue('note'),
        'type' => Helpers::getFormValue('type'),
    ];

    $google = $uploader->createFill($addArray);
}
if(Helpers::isFormSent('form-tank')){ // odesláno

    $tankArray = [
        'carname' => Helpers::getFormValue('carname'),
        'driver' => Helpers::getFormValue('driver'),
        'price' => Helpers::getFormValue('price'),
        'liters' => Helpers::getFormValue('liters'),
        'km_stav' => Helpers::getFormValue('km_stav'),
        'note' => Helpers::getFormValue('note')
    ];

    $google = $uploader->createTank($tankArray);

}
if(Helpers::isFormSent('form-create')){ // odesláno

    try {
        $car = new Car(
            new Content\Carname(Helpers::getFormValue('carname')),
            new Content\Name(Helpers::getFormValue('owner')),
            new Content\Name(Helpers::getFormValue('driver')),
            new Content\Km(Helpers::getFormValue('km_stav')),
        );
        $google = $uploader->createCar($car->toArray());

    } catch (ValidateException $e) {
        $error = $e->getMessage();
    } catch (UploaderException $e) {
        $error = $e->getMessage();
    } catch (\Exception $e) {
        Debugger::log($e, ILogger::ERROR);
        $error = 'Omlouvám se, něco se pokazilo, zkus to znovu.';
    }
}

?>

<? require __DIR__ . '/page/head.php'; ?>

<body>

<?php require __DIR__ . '/page/datalists.php'; ?>

<?php require __DIR__ . '/page/navbar.php'; ?>
<?php require __DIR__ . '/page/statusbar.php'; ?>

<?php

    switch($page) {
        case 'add': require __DIR__ . '/forms/add.php'; break;
        case 'tank': require __DIR__ . '/forms/tank.php'; break;
        case 'create': require __DIR__ . '/forms/create.php'; break;
        case 'show': require __DIR__ . '/page/show.php'; break;
        case 'welcome': require __DIR__ . '/page/welcome.php'; break;
        default: require __DIR__ . '/page/404.php'; break;
    }

?>

</body>
