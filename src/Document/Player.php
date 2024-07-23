<?php

namespace App\Document;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\PersistentCollection;

class Player
{
    private string $id;
    private User $user;
    private Statistics $statistics;
    private UI $ui;
    private Collection $games;

    public function __construct()
    {
        $this->user = new User();
        $this->statistics = new Statistics();
        $this->ui = new UI();
        $this->games = new ArrayCollection();
    }

    public function setUser(User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function setLogin(string $login): static
    {
        $this->user->setLogin($login);
        return $this;
    }

    public function setPassword(string $password): static
    {
        $this->user->setPassword($password);
        return $this;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getLogin(): string
    {
        return $this->user->getLogin();
    }

    public function getPassword(): string
    {
        return $this->user->getPassword();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getRole(): string
    {
        return $this->user->getRole();
    }

    public function getStatistics(): ?Statistics
    {
        return $this->statistics;
    }
    public function getUI(): UI
    {
        return $this->ui;
    }

    public function getGames(): ?array
    {
        return $this->games->toArray();
    }

    public function addGame(Game $game): static
    {
        $this->games->add($game);
        return $this;
    }
}