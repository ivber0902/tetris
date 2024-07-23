<?php

namespace App\Document;

class Statistics
{
    private int $lastScore;
    private int $totalScore;
    private int $maxScore;
    private int $gameCount;
    private int $winCount;

    public function __construct()
    {
        $this->lastScore = 0;
        $this->totalScore = 0;
        $this->maxScore = 0;
        $this->gameCount = 0;
        $this->winCount = 0;
    }

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