<?php

namespace App\Document;


class User
{
    private ?string $login = null;
    private ?string $password = null;

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

    public function getRole(): string
    {
        return 'ROLE_USER';
    }
}
