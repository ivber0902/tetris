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
                'maxScore' => $request->get('score', '0'),
            ]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('game-over.html.twig', [
            'lastScore' => $player->getLastScore(),
            'maxScore' => $player->getMaxScore(),
        ]);
    }
    public function blitzGameOver(Request $request): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->render('blitz-game-over.html.twig', [
                'lastScore' => $request->get('score', '0'),
                'maxScore' => $request->get('score', '0'),
            ]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('blitz-game-over.html.twig', [
            'lastScore' => $player->getLastScore(),
            'maxScore' => $player->getMaxScore(),
        ]);
    }
    public function game(): Response
    {
        return $this->render('game.html.twig');
    }
    public function blitz(): Response
    {
        return $this->render('blitz.html.twig');
    }
    public function selectMode(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->redirectToRoute('login');
        }
        return $this->render('select-mode.html.twig', ["user" => $securityUser]);
    }
    public function selectClassicMode(): Response
    {
        $securityUser = $this->getUser();
        return $this->render('select-classic-mode.html.twig', ["user" => $securityUser]);
    }
    public function selectSoloMode(): Response
    {
        $securityUser = $this->getUser();
        return $this->render('select-solo-mode.html.twig', ["user" => $securityUser]);
    }
    public function about(): Response
    {
        return $this->render('about.html.twig');
    }

    public function multiplayer(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser){
            $user = $this->userService->findUser($securityUser->getId());
            return $this->render('multiplayer.html.twig', ["user" => $user]);
        }
        else{
            return $this->redirectToRoute('login');
        }
    }
    public function join(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser){
            $user = $this->userService->findUser($securityUser->getId());
            return $this->render('list_lobby.html.twig', ["user" => $user]);
        }
        else{
            return $this->redirectToRoute('login');
        }
    }
    public function loginPage(): Response
    {
        return $this->render('user/login.html.twig');
    }
    public function lobby(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->redirectToRoute('login');
        }
        $user = $this->userService->findUser($securityUser->getId());
        return $this->render('lobby.html.twig', ["user" => $user]);
    }
}