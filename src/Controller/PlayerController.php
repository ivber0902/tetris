<?php

namespace App\Controller;

use App\Repository\PlayerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class PlayerController extends AbstractController
{
    public function __construct(private readonly PlayerRepository $playerRepository)
    {
    }

    public function index(): Response
    {
        $player = $this->playerRepository->find(1);
        var_dump($player);
        return $this->render('index.html.twig');
    }
}