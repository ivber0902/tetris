<?php

namespace App\Controller;

use App\Document\MultiplayerGame;
use App\Document\Player;
use App\Document\PlayerGameResults;
use App\Document\SingleGame;
use App\Repository\GameRepository;
use App\Repository\NUserRepository;
use App\Service\GameService;
use App\Service\PlayerService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class NoSQLTestController extends AbstractController
{
    public function __construct(
        private readonly DocumentManager $dm,
        private readonly GameRepository $gameRepository,
        private readonly PlayerService $playerService,
        private readonly GameService $gameService,
    )
    {}

    public function create() {
        $player = new Player();
        $player->setLogin("qwertyuiop");
        $player->setPassword("qwertyuiop");

        $this->dm->persist($player);
        $userId = $player->getId();

        return new Response('Created document with id: ' . $userId);
    }

    public function get() {
//        $this->gameService->saveMultiplayerGame(2, 234567);
        $this->gameService->addPlayerToMultiplayerGame(
            "66a0eca780d53e30c9055bcb",
            "669f47090ac8009e930758e2",
            3132,
            235456,
            6,
            3534,
            54,
            false,
            [
                [1, 2, 3, 4, 5, 6],
                [2, 3, 6, 4, 8, 7],
                [45,56, 54, 75,76,7, 8,67]
            ]
        );
        return new Response('Users');

    }
}