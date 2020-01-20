<?php

namespace App\Content;

use App\Validator\Validate;

class Name extends DataObject
{
    protected function validate($content)
    {
        Validate::required($content) && Validate::name($content);
    }
}
