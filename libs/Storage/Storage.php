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
            $filePath = $this->getNewFilePath($name);
        }

        $isFileSaved = @file_put_contents($filePath, $dataToWrite);

        if ($isFileSaved === false) {
            throw new StorageException('Unable to save file ' . $filePath . $isFileSaved);
        }
    }

    private function getNewFilePath($name)
    {
        $outputFolder = $this->path;

        $date = date('Y-m-d-H-i-s');
        $name = $this->sanitizeName($name);
        $random = Random::generate(4);

        return "$outputFolder/$date-$name-$random.json";
    }

    private function sanitizeName($name)
    {
        $name = Strings::webalize($name);
        $name = Strings::truncate($name, '30', '');
        return $name;
    }

    public function changeInfo($key, $values)
    {

        // $file = $this->getByKey($key);

        // $file['name'] = $values['name'];
        // $file['username'] = $values['username'];
        // $file['phone'] = $values['phone'];
        // $file['email'] = $values['email'];

        // $filePath = $this->path . '/' . $key;
        // $this->save('aby se nereklo', $file, $filePath);
        throw new StorageException("Není hotovo");

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
