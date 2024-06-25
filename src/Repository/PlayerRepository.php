<?php

namespace App\Repository;

use App\Entity\Player;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;


class PlayerRepository
{
    private EntityRepository $repository;

    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(Player::class);
    }

    public function store(Player $player): int
    {
        $this->entityManager->persist($player);
        $this->entityManager->flush();
        return $player->getId();
    }

    public function delete(Player $player): void
    {
        $this->entityManager->remove($player);
        $this->entityManager->flush();
    }

    public function find(int $id): Player
    {
        return $this->entityManager->find(Player::class, $id);
    }
}

