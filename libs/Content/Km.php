<?php

namespace App\Content;

use App\Validator\Validate;

class Km extends DataObject
{
    protected function validate($content)
    {
        Validate::required($content) && Validate::km($content);
    }
}
