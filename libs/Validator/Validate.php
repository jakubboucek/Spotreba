<?php

namespace App\Validator;

use App\Storage\Storage;

class Validate
{
    static function email($value)
    {
        $isValid = filter_var($value, FILTER_VALIDATE_EMAIL);
        if (!$isValid) {
            throw new ValidateException('Zadali jste neplatný e-mail, prosím zkontrolujte zadání a opravte jej.');
        }
        return $isValid;
    }


    static function name($value)
    {
        $isValid = !preg_match('/\d/', $value);
        if (!$isValid) {
            throw new ValidateException('Ve jménu nesmí být číslice, prosím upravte jej.');
        }
        return $isValid;
    }


    static function km($value)
    {
        $isValid = preg_match('/\d/', $value);
        if (!$isValid) {
            throw new ValidateException('V kilometrech musí být jen čísla.');
        }
        return $isValid;
    }


    static function username($value)
    {

        $isValid = preg_match('/^[.a-z0-9]+\z/i', $value);
        if (!$isValid) {
            throw new ValidateException('Přihlašovací jméno smí obsahovat jen latinská písmena bez diakritiky, čísla a tečky');
        }

        return $isValid;
    }

    static function usernameExistence($value)
    {

        $storage = new Storage(__DIR__ . '/../../output');
        $users = $storage->findKeys();

        foreach ($users as $name) {
            $data = $storage->getByKey($name);
            if ($value == $data['username']) {
                throw new ValidateException('Uživatelské jméno již existuje');
            }
        }
    }


    static function password($value)
    {
        if (mb_strlen($value) < 8) {
            throw new ValidateException('Heslo musí obsahovat alespoň 8 znaků');
        }
        return true;
    }


    static function phone($value)
    {
        $isValid = preg_match('/^ *(\d *){9}$/', $value);
        if (!$isValid) {
            throw new ValidateException('Telefon musí obsahovat právě 9 číslic, prosím opravte jej');
        }
        return $isValid;
    }


    static function required($value)
    {
        $isValid = ($value !== '');
        if (!$isValid) {
            throw new ValidateException('Nejsou vyplněna všechna povinná pole, prosím vyplňte je');
        }
        return $isValid;
    }
}
