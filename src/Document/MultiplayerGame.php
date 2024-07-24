<?php

namespace App\Document;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

class MultiplayerGame extends Game
{
    private int $difficulty = 0;
    private Collection $players;

    public function __construct()
    {
        $this->players = new ArrayCollection();
    }

    public function setDifficulty(int $difficulty): static
    {
        $this->difficulty = $difficulty;
        return $this;
    }

    public function getDifficulty(): int
    {
        return $this->difficulty;
    }

    public function getPlayers(): ?array
    {
        return $this->players->toArray();
    }

    public function setPlayers(?array $players): static
    {
        $this->players->clear();
        foreach ($players as $player) {
            $this->players->add($player);
        }
        return $this;
    }

    public function addPlayer(PlayerGameResults $player): static
    {
        $this->players->add($player);
        return $this;
    }
}