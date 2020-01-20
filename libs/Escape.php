<?php

namespace App;

class Escape
{
    public static function html($text)
    {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}
