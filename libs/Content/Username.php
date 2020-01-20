<?php

namespace App\Content;

use App\Validator\Validate;

class Username extends DataObject
{
    protected function validate($content)
    {
        Validate::required($content) && Validate::username($content);
    }
}
