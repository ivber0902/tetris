<?php

namespace App\Controller;

use App\Document\Game;
use App\Document\MultiplayerGame;
use App\Document\Player;
use App\Service\GameService;
use App\Service\PlayerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class GameController extends AbstractController
{
    public function __construct(
        private readonly PlayerService $playerService,
        private readonly GameService $gameService,
    )
    {
    }

    public function menu(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null){
            return $this->render('menu/menu.html.twig');
        }
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('menu/menu.html.twig', ["player" => $player]);
    }
    public function settings(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->render('menu/settings.html.twig');
        }
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('menu/settings.html.twig', ["player" => $player]);
    }
    public function leaderboard(): Response
    {
        $securityUser = $this->getUser();
        if($securityUser === null){
            return $this->render('menu/leaderboard.html.twig');
        }
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('menu/leaderboard.html.twig', ["player" => $player]);
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
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('game/game-over.html.twig', [
            'lastScore' => $player->getStatistics()->getLastScore(),
            'maxScore' => $player->getStatistics()->getMaxScore(),
        ]);
    }
    public function gameOverMode(): Response
    {
        return $this->render('game/game-over-mode.html.twig');
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
            return $this->render('multiplayer/game-over-multi.html.twig');
        }
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('multiplayer/game-over-multi.html.twig', ["player" => $player]);
    }
    public function koop(): Response
    {
        return $this->render('game_modes/koop.html.twig');
    }
    public function bot(): Response
    {
        return $this->render('game_modes/bot.html.twig');
    }
    public function l40(): Response
    {
        return $this->render('game_modes/l40.html.twig');
    }
    public function selectMultiplayerMode(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->render('select_modes/select-multiplayer-mode.html.twig');
        }
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('select_modes/select-multiplayer-mode.html.twig', ["player" => $player]);
    }
    public function selectDif(): Response
    {
        $securityUser = $this->getUser();
        if($securityUser === null){
            return $this->render('select_modes/select-classic-mode.html.twig');
        }
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('select_modes/select-classic-mode.html.twig', ["player" => $player]);
    }
    public function selectKoop(): Response
    {
        $securityUser = $this->getUser();
        if($securityUser === null){
            return $this->render('select_modes/select-koop-mode.html.twig');
        }
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('select_modes/select-koop-mode.html.twig', ["player" => $player]);
    }
    public function selectSoloMode(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null){
            return $this->render('select_modes/select-solo-mode.html.twig');
        }
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('select_modes/select-solo-mode.html.twig', ["player" => $player]);
    }
    public function about(): Response
    {
        return $this->render('menu/about.html.twig');
    }

    public function multiplayer(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser){
            $player = $this->playerService->findPlayer($securityUser->getId());
            return $this->render('multiplayer/multiplayer.html.twig', ["player" => $player]);
        } else {
            return $this->redirectToRoute('login');
        }
    }
    public function join(): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser){
            $player = $this->playerService->findPlayer($securityUser->getId());
            return $this->render('multiplayer/list_lobby.html.twig', ["player" => $player]);
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
        $player = $this->playerService->findPlayer($securityUser->getId());
        return $this->render('multiplayer/lobby.html.twig', ["player" => $player]);
    }

    public function getGamesWithFiltering(Request $request): Response
    {
        $sortKey = $request->get('sortKey') ?? "id";
        $count  = $request->get('count') ?? null;

        $filters = [];
        foreach (["mode", "time", "tetrisCount",
                     "figureCount", "filledRows", "fieldMode",
                     "isWon", "playerId"] as $key) {
            if (($filter = $request->get($key)) !== null) {
                if ($key === "isWon") {
                    $filters[$key] = $filter != 0 || $filter !== "false";
                    continue;
                }
                $filters[$key] = $filter;
            }
        }

        $games = $this->gameService->getRating($count, $sortKey, $filters);
        return $this->json(array_map(function ($game) {
            return $this->gameService->serializeGameInfoToArray($game);
        }, $games), Response::HTTP_OK);
    }

    public function countGamesWithFiltering(Request $request): Response
    {
        $filters = [];
        foreach (["mode",
                     "time", "tetrisCount",
                     "figureCount", "filledRows", "field_mode",
                     "isWon", "playerId"] as $key) {
            if (($filter = $request->get($key)) !== null) {
                if ($key === "isWon") {
                    $filters[$key] = $filter != 0 || $filter !== "false";
                    continue;
                }
                $filters[$key] = $filter;
            }
        }

        $games = $this->gameService->getRating(null, null, $filters);
        return $this->json([
            "count" => count($games),
        ]);
    }

    public function storeMultiplayerGame(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $gameId = $this->gameService->saveMultiplayerGame(
            $data["mode"] ?? 0,
            $data["time"] ?? 0,
        );

        foreach ($data["players"] ?? [] as $player) {
            $this->gameService->addPlayerToMultiplayerGame(
                $gameId,
                $player["id"] ?? 0,
                $player["score"] ?? 0,
                $player["time"] ?? 0,
                $player["tetris_count"] ?? 0,
                $player["figure_count"] ?? 0,
                $player["filled_rows"] ?? 0,
                $player["is_won"] ?? false,
                $player["play_field"] ?? [],
            );
        }
        return $this->json([], Response::HTTP_OK);
    }
}