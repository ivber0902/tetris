<?php

namespace App\Document;

class SingleGame extends Game
{
    private ?string $playerId = null;
    private int $score = 0;
    private int $tetrisCount = 0;
    private int $figureCount = 0;
    private int $filledRows = 0;
    private int $fieldMode = 0;
    private bool $isWon = false;

    public function getPlayerId(): ?string
    {
        return $this->playerId;
    }
    public function setPlayerId(string $playerId): static
    {
        $this->playerId = $playerId;
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

