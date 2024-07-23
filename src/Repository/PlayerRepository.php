<?php

namespace App\Repository;

use App\Document\Player;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;


class PlayerRepository
{
    private DocumentRepository $repository;

    public function __construct(private readonly DocumentManager $documentManager)
    {
        $this->repository = $documentManager->getRepository(Player::class);
    }

    public function store(Player $player): string
    {
        $this->documentManager->persist($player);
        $this->documentManager->flush();
        return $player->getId();
    }

    public function delete(Player $player): void
    {
        $this->documentManager->remove($player);
        $this->documentManager->flush();
    }

    public function find(string $id): ?Player
    {
        return $this->repository->find($id);
    }

    public function findByLogin(string $login): ?Player
    {
        return $this->repository->findOneBy(['user.login' => $login]);
    }

    public function findBy(array $criteria): ?Player
    {
        return $this->repository->findOneBy($criteria);
    }
}

