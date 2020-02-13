<?php

namespace App\Validator;
use App\Storage\Storage;

class Validate
{

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

    static function required($value)
    {
        $isValid = ($value !== '');
        if (!$isValid) {
            throw new ValidateException('Nejsou vyplněna všechna povinná pole, prosím vyplňte je');
        }
        return $isValid;
    }
}
