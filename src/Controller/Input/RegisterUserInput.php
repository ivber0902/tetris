<?php

namespace App\Controller\Input;

use App\Service\Input\RegisterUserInputInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class RegisterUserInput extends AbstractType implements RegisterUserInputInterface {
    private string $login;
    private string $password;

    public function getLogin(): string
    {
        return $this->login;
    }
    public function setLogin(string $login): void
    {
        $this->login = $login;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('login', TextType::class)
                ->add('password', PasswordType::class)
                ->add('submit', SubmitType::class);
    }
}