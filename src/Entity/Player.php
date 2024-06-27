<?php

namespace App\Entity;

class Player
{
    private readonly ?int $id;
    private ?int $userId;
    private ?int $maxScore = 0;
    private ?int $averageScore = 0;
    private ?int $totalScore = 0;
    private ?int $gameCount = 0;
    private ?int $winCount = 0;
    private ?int $lastScore = 0;

    private ?User $user;

    public function getId(): ?int
    {
        return $this->id;
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
    public function setUser(?User $user): void
    {
        $this->user = $user;
    }
    public function getUser(): ?User
    {
        return $this->user;
    }

    public function getLastScore(): ?int
    {
        return $this->lastScore;
    }

    public function setLastScore(?int $lastScore): static {
        $this->lastScore = $lastScore;
        return $this;
    }

    public function setUserId(?int $userId): static
    {
        $this->userId = $userId;
        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }
}
