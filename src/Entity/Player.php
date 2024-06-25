<?php

namespace App\Entity;

class Player
{
    private ?int $id = null;
    private ?int $userId = null;
    private ?int $maxScore = null;
    private ?int $averageScore = null;
    private ?int $totalScore = null;
    private ?int $gameCount = null;
    private ?int $winCount = null;

    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getMaxScore(): ?int
    {
        return $this->maxScore;
    }

    public function setMaxScore(?int $maxScore): static
    {
        $this->maxScore = $maxScore;

        return $this;
    }

    public function getTotalScore(): ?int
    {
        return $this->totalScore;
    }

    public function setTotalScore(?int $totalScore): static
    {
        $this->totalScore = $totalScore;

        return $this;
    }

    public function getGameCount(): ?int
    {
        return $this->gameCount;
    }

    public function setGameCount(?int $gameCount): static
    {
        $this->gameCount = $gameCount;

        return $this;
    }

    public function getWinCount(): ?int
    {
        return $this->winCount;
    }

    public function setWinCount(?int $winCount): static
    {
        $this->winCount = $winCount;

        return $this;
    }

    public function getAverageScore(): ?int
    {
        return $this->averageScore;
    }

    public function setAverageScore(?int $averageScore): static {
        $this->averageScore = $averageScore;
        return $this;
    }

    /**
     * @return null
     */
    public function getUser(): null
    {
        return $this->user;
    }
}
