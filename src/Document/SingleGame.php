<?php

namespace App\Document;

class SingleGame extends Game
{
    private int $score;
    private int $tetrisCount;
    private int $figureCount;
    private int $filledRows;
    private int $fieldMode;

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
    public function setTetrisCount(int $tetrisCount): void
    {
        $this->tetrisCount = $tetrisCount;
    }
    public function getFigureCount(): int
    {
        return $this->figureCount;
    }
    public function setFigureCount(int $figureCount): void
    {
        $this->figureCount = $figureCount;
    }

    public function getFilledRows(): int
    {
        return $this->filledRows;
    }
    public function setFilledRows(int $filledRows): void
    {
        $this->filledRows = $filledRows;
    }

    public function getFieldMode(): int
    {
        return $this->fieldMode;
    }

    public function setFieldMode(int $fieldMode): void
    {
        $this->fieldMode = $fieldMode;
    }
}

