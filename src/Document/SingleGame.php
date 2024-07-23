<?php

namespace App\Document;

class SingleGame extends Game
{
    private int $score;
    private int $tetrisCount;
    private int $figureCount;
    private int $filledRows;
    private int $fieldMode;
    private bool $isWon;

    public function getScore(): int
    {
        return $this->score;
    }
    public function setScore(int $score): void
    {
        $this->score = $score;
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

    public function getFieldMode(): int
    {
        return $this->fieldMode;
    }

    public function setFieldMode(int $fieldMode): static
    {
        $this->fieldMode = $fieldMode;
        return $this;
    }

    public function isWon(): bool
    {
        return $this->isWon;
    }

    public function setIsWon(bool $isWon): static
    {
        $this->isWon = $isWon;
        return $this;
    }
}

