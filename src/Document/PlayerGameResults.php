<?php

namespace App\Document;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class PlayerGameResults
{
    private string $id;
    private int $score = 0;
    private int $time = 0;
    private int $tetrisCount = 0;
    private int $figureCount = 0;
    private int $filledRows = 0;
    private bool $isWon = false;
    private array $playField;

    public function getId(): string
    {
        return $this->id;
    }
    public function setId(string $id): static
    {
        $this->id = $id;
        return $this;
    }

    public function getScore(): int
    {
        return $this->score;
    }
    public function setScore(int $score): static
    {
        $this->score = $score;
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

    public function getTetrisCount(): int
    {
        return $this->tetrisCount;
    }
    public function setTetrisCount(int $tetrisCount): static
    {
        $this->tetrisCount = $tetrisCount;
        return $this;
    }

    public function getFigureCount(): int
    {
        return $this->figureCount;
    }
    public function setFigureCount(int $figureCount): static
    {
        $this->figureCount = $figureCount;
        return $this;
    }

    public function getFilledRows(): int
    {
        return $this->filledRows;
    }
    public function setFilledRows(int $filledRows): static
    {
        $this->filledRows = $filledRows;
        return $this;
    }

    public function getIsWon(): bool
    {
        return $this->isWon;
    }
    public function setIsWon(bool $isWon): static
    {
        $this->isWon = $isWon;
        return $this;
    }

    public function getPlayField(): array
    {
        return $this->playField;
    }
    public function setPlayField(array $playField): static
    {
        $this->playField = $playField;
        return $this;
    }
}
