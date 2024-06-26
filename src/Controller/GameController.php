<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class GameController extends AbstractController
{

    public function menu(): Response
    {
        return $this->render('menu.html.twig');
    }
    public function game_over(): Response
    {
        return $this->render('game-over.html.twig');
    }

    public function game(): Response
    {
        return $this->render('game.html.twig');
    }

    public function loginPage(): Response
    {
        return $this->render('user/login.html.twig');
    }
}