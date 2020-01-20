<?php

namespace App;

class Car
{

    private $carname;
    private $owner;
    private $user;
    private $km_stav;

    function __construct($carname, $owner, $user, $km_stav)
    {
        $this->carname = $carname;
        $this->owner = $owner;
        $this->user = $user;
        $this->km_stav = $km_stav;
    }

    public function toArray() {

        $array = [
            'carname' => (string)Escape::html($this->carname),
            'owner' => (string)Escape::html($this->owner),
            'user' => (string)Escape::html($this->user),
            'km_stav' => (string)Escape::html($this->km_stav),
        ];

        return $array;
    }
}
