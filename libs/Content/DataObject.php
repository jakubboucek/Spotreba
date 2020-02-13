<?php

namespace App\Content;

abstract class DataObject
{
    protected $checkValidity = true;
    protected $content;

    public function __construct($content)
    {
        if ($this->checkValidity) {
            $this->validate($content);
        }
        $this->content = $content;
    }

    protected function validate($content)
    {
    }

    public function getContent()
    {
        return $this->content;
    }

    public function __toString()
    {
        return $this->getContent();
    }
}
