<?php

namespace App\Controller;

use App\Repository\PlayerRepository;
use App\Service\PlayerService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PlayerController extends AbstractController
{
    public function __construct(
        private readonly PlayerService $playerService,
        private readonly UserService   $userService,
    )
    {
    }

    public function updateStatistics(Request $request): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->json([], Response::HTTP_UNAUTHORIZED);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player_id = $user->getPlayerId();

        $statistics = json_decode($request->getContent(), true);
        if ($statistics !== null) {
            $this->playerService->updateStatistics(
                $player_id,
                $statistics['score'] ?? null,
                $statistics['isWon'] ?? null,
            );
        }
        return new Response("Hello");
    }
}