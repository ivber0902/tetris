<?php

namespace App\Controller;

use App\Repository\PlayerRepository;
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

    public function getUserApi(string $id): Response
    {
        $player = $this->service->findPlayer($id);

        if ($player === null) {
            return $this->json([], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        return $this->json([
            "id" => $player->getId(),
            "login" => $player->getLogin(),
        ], Response::HTTP_OK);
    }

    public function updateAvatarPath(Request $request): Response
    {

        $securityUserId = $this->getUser()->getId();
        $player = $this->service->findPlayer($securityUserId);
        $avatarPath = $this->imageService->updateImage($player->getAvatar(), $request->files->get('avatarPath'));
        $this->service->updateAvatarPath($avatarPath, $securityUserId);
        return $this->redirectToRoute("profile" , ["player" => $player, "login" => $player->getLogin()]);
    }
}