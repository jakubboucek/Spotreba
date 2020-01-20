<?php

namespace App\Content;

use App\Validator\Validate;

class Carname extends DataObject
{
    protected function validate($content)
    {
        Validate::required($content);
    }
}
