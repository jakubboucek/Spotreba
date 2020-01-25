<?php

namespace App;

use Nette\Utils\Random;
use App\Content\Carname;
use App\Content\Name;
use App\Content\Km;

class Car
{

    private $carname;
    private $owner;
    private $driver;
    private $km_stav;
    private $carId;

    function __construct(Carname $carname, Name $owner,  Name $driver, Km $km_stav)
    {
        $this->carname = $carname;
        $this->owner = $owner;
        $this->driver = $driver;
        $this->km_stav = $km_stav;
        $this->carId = Random::generate(5);

    }

    public function toArray() {

        $array = [
            'carname' => (string)$this->carname,
            'owner' => (string)$this->owner,
            'driver' => (string)$this->driver,
            'km_stav' => (string)$this->km_stav,
            'carId' => (string)$this->carId,
        ];

        return $array;
    }

    public function getId() {return $this->carId; }
    public function getCarname() {return $this->carname; }
}
