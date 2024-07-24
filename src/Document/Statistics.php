<?php

namespace App\Document;

use Doctrine\ORM\Query\Expr\Base;

class Statistics
{
    private int $lastScore = 0;
    private int $totalScore = 0;
    private int $maxScore = 0;
    private int $gameCount = 0;
    private int $winCount = 0;

    public function getLastScore(): int
    {
        return $this->lastScore;
    }
    public function setLastScore(int $lastScore): static
    {
        $this->lastScore = $lastScore;
        return $this;
    }

    public function getTotalScore(): int
    {
        return $this->totalScore;
    }
    public function setTotalScore(int $totalScore)
    {
        $this->totalScore = $totalScore;
        return $this;
    }

    public function getMaxScore(): int
    {
        return $this->maxScore;
    }
    public function setMaxScore(int $maxScore)
    {
        $this->maxScore = $maxScore;
        return $this;
    }

    public function getGameCount(): int
    {
        return $this->gameCount;
    }
    public function setGameCount(int $gameCount)
    {
        $this->gameCount = $gameCount;
        return $this;
    }

    public function getWinCount(): int
    {
        return $this->winCount;
    }
    public function setWinCount(int $winCount)
    {
        $this->winCount = $winCount;
        return $this;
    }
}