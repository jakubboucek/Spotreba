<?php

namespace App\Uploader;

use Nette\Utils\Json;
use Nette\Utils\Random;
use Nette\Utils\Strings;

class Uploader
{

    private $url;

    public function __construct($googleUrl)
    {
        $this->url = $googleUrl;
    }

    public function createCar($data)
    {

        $googleURL = $this->url
            .'?action='.urlencode('AddNewCar')
            .'&add_name='.urlencode($data['carname'])
            .'&add_user='.urlencode($data['driver'])
            .'&add_owner='.urlencode($data['owner'])
            .'&add_km='.urlencode($data['km_stav'])
        ;

        $response = file_get_contents($googleURL);
        $response = json_decode($response);
        return $response;

        if (!$isFileSaved) {
            throw new UploaderException('Unable to contact google!');
        }
    }

    public function createTank($data)
    {
        $googleURL = $this->url
            .'?action='.urlencode('Tankování')
            .'&tank_name='.urlencode($data['carname'])
            .'&tank_driver='.urlencode($data['driver'])
            .'&tank_price='.urlencode($data['price'])
            .'&tank_l='.urlencode($data['liters'])
            .'&tank_km='.urlencode($data['km_stav'])
            .'&tank_note='.urlencode($data['note'])
        ;

        $response = file_get_contents($googleURL);
        $response = json_decode($response);
        return $response;

        if (!$isFileSaved) {
            throw new UploaderException('Unable to contact google!');
        }
    }

    public function createFill($data)
    {

        $googleURL = $this->url
            .'?action='.urlencode('Zaznamenat')
            .'&fill_name='.urlencode($data['carname'])
            .'&fill_odkud='.urlencode($data['odkud'])
            .'&fill_pres='.urlencode($data['pres'])
            .'&fill_kam='.urlencode($data['kam'])
            .'&fill_driver='.urlencode($data['driver'])
            .'&fill_kilometru='.urlencode($data['km-ujeto'])
            .'&fill_konecny='.urlencode($data['km_stav'])
            .'&fill_note='.urlencode($data['note'])
            .'&fill_type='.urlencode($data['type'])
        ;

        $response = file_get_contents($googleURL);
        $response = json_decode($response);
        return $response;

        if (!$isFileSaved) {
            throw new UploaderException('Unable to contact google!');
        }
    }

    public function showData()
    {

        $googleURL = $this->url
            .'?action='.urlencode('Zaznamenat')
        ;

        $response = file_get_contents($googleURL);
        $response = json_decode($response);
        return $response;

        if (!$isFileSaved) {
            throw new UploaderException('Unable to contact google!');
        }
    }

}
