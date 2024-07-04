<?php

namespace App\Controller;

use App\Repository\PlayerRepository;
use App\Service\PlayerService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class PlayerController extends AbstractController
{
    public function __construct(
        private readonly PlayerService $playerService,
        private readonly UserService   $userService,
    )
    {
    }

    public function profile(string $login): Response
    {
        $user = $this->userService->findUserByLogin($login);
        if ($user !== null) {
            return $this->render('profile.html.twig', [
                "login" => $login,
                "player" => $user->getPlayer(),
            ]);
        }
        throw new NotFoundHttpException();
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

    public function getPlayerApi()
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->json([], Response::HTTP_UNAUTHORIZED);
        }
        $user = $this->userService->findUser($securityUser->getId());
        $player = $user->getPlayer();
        return $this->json([
            "id" => $player->getId(),
            ""
        ], Response::HTTP_OK);
    }

    public function getUserApi(int $id): Response
    {
        $user = $this->userService->findUserByPlayerId($id);
        return $this->json([
            "id" => $user->getId(),
            "login" => $user->getLogin(),
        ], Response::HTTP_OK);
    }
}