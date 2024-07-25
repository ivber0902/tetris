<?php

namespace App\Document;

class Game
{
    private string $id;
    private int $mode = 0;
    private int $time = 0;

    public function getId(): string
    {
        return $this->id;
    }

    public function getMode(): int
    {
        return $this->mode;
    }
    public function setMode(int $mode): static
    {
        $this->mode = $mode;
        return $this;
    }

    public function getTime(): int
    {
        return $this->time;
    }
    public function setTime(int $time): static
    {
        $this->time = $time;
        return $this;
    }
}