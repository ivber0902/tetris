<?php

namespace App\Controller;

use App\Document\Player;
use App\Document\SingleGame;
use App\Repository\NUserRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class NoSQLTestController extends AbstractController
{
    public function __construct(
        private readonly DocumentManager $dm,
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
//        $all = $this->dm->getRepository(Player::class)->findAll();
//        var_dump($all);

        $player = $this->dm->getRepository(Player::class)->find("669e71639d05f7a5c00ce72d");
        var_dump($player->getGames());

//        $player = new Player();
//        $player->setLogin("qwertyuiop");
//        $player->setPassword("qwertyuiop");

//        $game = new SingleGame();
//        $game->setMode(92);
//        $game->setTime(124534567);
//        $game->setScore(123);
//        $game->setFieldMode(25);
//        $game->setFilledRows(12);
//        $game->setFigureCount(98123);
//        $game->setTetrisCount(92);
//
//        $player->addGame($game);
//        $this->dm->persist($game);
//        $this->dm->persist($player);
//        $this->dm->flush();
//
//        var_dump($game);
        return new Response('Users');

    }
}