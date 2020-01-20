<?php

namespace App;

use App\Content\Carname;
use App\Content\Name;
use App\Content\Km;

class Car
{

    private $carname;
    private $owner;
    private $driver;
    private $km_stav;

    function __construct(Carname $carname, Name $owner,  Name $driver, Km $km_stav)
    {
        $this->carname = $carname;
        $this->owner = $owner;
        $this->driver = $driver;
        $this->km_stav = $km_stav;
    }

    public function toArray() {

        $array = [
            'carname' => (string)Escape::html($this->carname),
            'owner' => (string)Escape::html($this->owner),
            'driver' => (string)Escape::html($this->driver),
            'km_stav' => (string)Escape::html($this->km_stav),
        ];

        return $array;
    }
}
