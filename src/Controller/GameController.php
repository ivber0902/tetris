<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class GameController extends AbstractController
{
    public function __construct(
        private readonly UserService $userService,
    )
    {
    }

    public function menu(): Response
    {
        $securityUser = $this->getUser();
        return $this->render('menu.html.twig', ["user" => $securityUser]);
    }
    public function gameOver(Request $request): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->render('game-over.html.twig', [
                'lastScore' => $request->get('score', '0'),
                'totalScore' => $request->get('score', '0'),
            ]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('game-over.html.twig', [
            'lastScore' => $player->getLastScore(),
            'maxScore' => $player->getMaxScore(),
        ]);
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