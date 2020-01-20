<?php

namespace App\Content;

use App\Validator\Validate;

class Phone extends DataObject
{
    protected function validate($content)
    {
        Validate::phone($content);
    }
}
