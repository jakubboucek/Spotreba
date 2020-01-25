<?php

namespace App\Storage;

use Nette\Utils\Json;
use Nette\Utils\Random;
use Nette\Utils\Strings;

class Storage
{

    private $path;

    public function __construct($path)
    {
        $this->path = $path;
    }

    public function createCar($name, $data, $filePath = null)
    {
        $dataToWrite = Json::encode($data, Json::PRETTY);

        if (!isset($filePath)) {
            $rnd = $data['carId'];
            $filePath = $this->getNewFilePath($name, $rnd);
        }

        $isFileSaved = @file_put_contents($filePath, $dataToWrite);

        if ($isFileSaved === false) {
            throw new StorageException('Unable to save file ' . $filePath . $isFileSaved);
        }
    }

    private function getNewFilePath($name, $random)
    {
        $outputFolder = $this->path;

        $date = date('Y-m-d-H-i-s');
        $name = $this->sanitizeName($name);

        return "$outputFolder/$date-$name-$random.json";
    }

    private function sanitizeName($name)
    {
        $name = Strings::webalize($name);
        $name = Strings::truncate($name, '30', '');
        return $name;
    }

    public function changeCar($key, $values)
    {

        $file = $this->getByKey($key);

        $file['carname'] = $values['carname'];
        $file['owner'] = $values['owner'];
        $file['driver'] = $values['driver'];
        $file['km_stav'] = $values['km_stav'];

        $filePath = $this->path . '/' . $key;
        $this->createCar('nic', $file, $filePath);

    }

    public function newDrive($key, $values)
    {

        $file = $this->getByKey($key);

        $file['driveID'] = $values['driveId'];
        $file['odkud'] = $values['odkud'];
        $file['pres'] = $values['pres'];
        $file['kam'] = $values['kam'];
        $file['driver'] = $values['driver'];
        $file[''] = $values[''];
        $file[''] = $values[''];
        $file[''] = $values[''];
        $file[''] = $values[''];

        $filePath = $this->path . '/' . $key;
        $this->createCar('nic', $file, $filePath);

    }

    public function findKeys()
    {

        $data = [];
        $files = scandir($this->path);

        foreach ($files as $file) {
            if (preg_match('/^\d{4}(-\d\d){5}-.+\.json$/', $file)) {
                $data[] = $file;
            }
        }

        return $data;
    }

    public function getByKey($key)
    {

        $content = file_get_contents($this->path . "/" . $key);
        $data = null;
        if ($content) {
            $data = Json::decode($content, Json::FORCE_ARRAY);
        }
        return $data;
    }
}
