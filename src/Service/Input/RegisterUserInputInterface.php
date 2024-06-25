<?php
declare(strict_types=1);

namespace App\Service\Input;

interface RegisterUserInputInterface
{
    public function getLogin(): string;
    public function getPassword(): string;
}