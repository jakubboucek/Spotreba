<?php

namespace App;

class Helpers
{

    public static function getFormValue($inputName, $default = '')
    {
        if (isset($_POST[$inputName])) {
            return $_POST[$inputName];
        }
        return $default;
    }


    public static function isFormSent($formName)
    {
        return self::getFormValue('action') === $formName;
    }


    public static function isFilled($value)
    {
        return $value !== '';
    }
}
