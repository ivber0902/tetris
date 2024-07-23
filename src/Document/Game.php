<?php

namespace App\Document;

class Game
{
    private string $id;
    private int $mode;
    private int $time;

    public function getId(): string
    {
        return $this->id;
    }

    public function getMode(): int
    {
        return $this->mode;
    }
    public function setMode(int $mode): void
    {
        $this->mode = $mode;
    }

    public function getTime(): int
    {
        return $this->time;
    }
    public function setTime(int $time): void
    {
        $this->time = $time;
    }

    public function getDifficulty(): int
    {
        return $this->difficulty;
    }
    public function setDifficulty(int $difficulty): void
    {
        $this->difficulty = $difficulty;
    }
}