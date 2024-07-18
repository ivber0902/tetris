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
        if($securityUser === null){
            return $this->render('menu/menu.html.twig', ["user" => $securityUser]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('menu/menu.html.twig', ["user" => $securityUser, "player" => $player]);
    }
    public function gameOver(Request $request): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->render('game/game-over.html.twig', [
                'lastScore' => $request->get('score', '0'),
                'maxScore' => $request->get('score', '0'),
            ]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('game/game-over.html.twig', [
            'lastScore' => $player->getLastScore(),
            'maxScore' => $player->getMaxScore(),
        ]);
    }
    public function game(): Response
    {
        return $this->render('game/game.html.twig');
    }
    public function blitz(): Response
    {
        return $this->render('game_modes/blitz.html.twig');
    }
    public function gameOverMulti(): Response
    {
        $securityUser = $this->getUser();
        if($securityUser === null){
            return $this->render('multiplayer/game-over-multi.html.twig', ["user" => $securityUser]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('multiplayer/game-over-multi.html.twig', ["user" => $user, "player" => $player]);
    }
    public function koop(): Response
    {
        return $this->render('game_modes/koop.html.twig');
    }
    public function l40(): Response
    {
        return $this->render('game_modes/l40.html.twig');
    }
    public function selectMultiplayerMode(): Response
    {
        $securityUser = $this->getUser();
        if($securityUser === null){
            return $this->render('select_modes/select-multiplayer-mode.html.twig', ["user" => $securityUser]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('select_modes/select-multiplayer-mode.html.twig', ["user" => $securityUser, "player" => $player]);
    }
    public function selectDif(): Response
    {
        $securityUser = $this->getUser();
        if($securityUser === null){
            return $this->render('select_modes/select-classic-mode.html.twig', ["user" => $securityUser]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('select_modes/select-classic-mode.html.twig', ["user" => $securityUser, "player" => $player]);
    }
    public function selectKoop(): Response
    {
        $securityUser = $this->getUser();
        return $this->render('select_modes/select-koop-mode.html.twig', ["user" => $securityUser]);
    }
    public function selectSoloMode(): Response
    {
        $securityUser = $this->getUser();
        if($securityUser === null){
            return $this->render('select_modes/select-solo-mode.html.twig', ["user" => $securityUser]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('select_modes/select-solo-mode.html.twig', ["user" => $securityUser, "player" => $player]);
    }
    public function about(): Response
    {
        return $this->render('menu/about.html.twig');
    }

    public function multiplayer(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser){
            $user = $this->userService->findUser($securityUser->getId());
            return $this->render('multiplayer/multiplayer.html.twig', ["user" => $user]);
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
            return $this->render('multiplayer/list_lobby.html.twig', ["user" => $user]);
        } else {
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
        $player = $user->getPlayer();
        return $this->render('multiplayer/lobby.html.twig', ["user" => $user, "player" => $player]);
    }
    public function leaderboard(): Response
    {
        $securityUser = $this->getUser();
        if($securityUser === null){
            return $this->render('menu/leaderboard.html.twig', ["user" => $securityUser]);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->render('menu/leaderboard.html.twig', ["user" => $securityUser, "player" => $player]);
    }
}