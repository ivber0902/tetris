<?php

namespace App\Entity;

class User
{
    private ?int $id = null;
    private ?string $login = null;
    private ?string $password = null;
    private ?Player $player = null;

    private ?int $playerId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLogin(): ?string
    {
        return $this->login;
    }

    public function setLogin(string $login): static
    {
        $this->login = $login;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPlayer(): ?Player
    {
        return $this->player;
    }

    public function getPlayerId(): ?int
    {
        return $this->playerId;
    }

    public function setPlayerId(int $playerId): static
    {
        $this->playerId = $playerId;
        return $this;
    }
}
