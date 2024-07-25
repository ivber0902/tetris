<?php

namespace App\Controller;

use App\Document\Player;
use App\Service\GameService;
use App\Service\PlayerService;
use App\Service\ImageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class PlayerController extends AbstractController
{
    public function __construct(
        private readonly PlayerService $service,
        private readonly GameService $gameService,
        private readonly ImageService $imageService,
    )
    {
    }

    public function profile(string $login): Response
    {
        $player = $this->service->findPlayerByLogin($login);
        if ($player !== null) {
            return $this->render('menu/profile.html.twig', [
                "player" => $player,
            ]);
        }
        throw new UnprocessableEntityHttpException();
    }

    public function statistics(string $login): Response
    {
        $player = $this->service->findPlayerByLogin($login);
        if ($player !== null) {
            return $this->render('menu/statistics.html.twig', [
                "player" => $player,
            ]);
        }
        throw new UnprocessableEntityHttpException();
    }

    public function updateStatistics(Request $request): Response
    {
        $securityUser = $this->getUser();
        if ($securityUser === null) {
            return $this->json([], Response::HTTP_UNAUTHORIZED);
        }
        $player = $this->service->findPlayer($securityUser->getId());

        $statistics = json_decode($request->getContent(), true);
        if ($statistics !== null) {
            $this->service->updateStatistics(
                $player->getId(),
                $statistics['score'] ?? null,
                $statistics['isWon'] ?? null,
            );
        }
        return new Response("Hello");
    }

    public function storeSingleGame(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data["mode"])) {
            return $this->json([], Response::HTTP_BAD_REQUEST);
        }
        $user = $this->getUser();
        if ($user === null) {
            return $this->json([], Response::HTTP_UNAUTHORIZED);
        }
        $player = $this->service->findPlayer($user->getId());
        if ($player === null) {
            return $this->json([], Response::HTTP_UNAUTHORIZED);
        }
        $gameId = $this->gameService->saveSingleGame(
            $player->getId(),
            $data["mode"],
            $data["time"] ?? 0,
            $data["score"] ?? 0,
            $data["tetris_count"] ?? 0,
            $data["figure_count"] ?? 0,
            $data["filled_rows"] ?? 0,
            $data["field_mode"] ?? 0,
            $data["is_won"] ?? false,
        );
        $this->service->updateStatistics($player->getId(), $data["score"]);

        return $this->json(["game" => $gameId], Response::HTTP_OK);
    }

    public function getUserApi(string $id): Response
    {
        $player = $this->service->findPlayer($id);

        if ($player === null) {
            return $this->json([], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        return $this->json($this->service->serializePlayerInfoToArray($player), Response::HTTP_OK);
    }

    public function updateAvatarPath(Request $request): Response
    {
        $securityUserId = $this->getUser()->getId();
        $player = $this->service->findPlayer($securityUserId);
        $avatarPath = $this->imageService->updateImage($player->getAvatar(), $request->files->get('avatarPath'));
        $this->service->updateAvatarPath($avatarPath, $securityUserId);
        return $this->redirectToRoute("profile" , ["player" => $player, "login" => $player->getLogin()]);
    }

    public function getRating(Request $request): Response
    {
        $count = $request->get('count');
        $key = $request->get('sortKey');
        if ($count === null || $key === null || (int)$count <= 0) {
            return $this->json([], Response::HTTP_BAD_REQUEST);
        }
        $players = $this->service->getRating($count, $key);

        return $this->json(
            array_map(function ($player) {
                return $this->service->serializePlayerInfoToArray($player);
            }, $players), Response::HTTP_OK
        );
    }
}