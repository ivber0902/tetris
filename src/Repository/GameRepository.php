<?php

namespace App\Repository;

use App\Document\Game;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

class GameRepository
{
    private DocumentRepository $repository;
    public function __construct(private DocumentManager $documentManager)
    {
        $this->repository = $documentManager->getRepository(Game::class);
    }

    public function store(Game $game): string
    {
        $this->documentManager->persist($game);
        $this->documentManager->flush();
        return $game->getId();
    }

    public function delete(Game $game): void
    {
        $this->documentManager->remove($game);
        $this->documentManager->flush();
    }

    public function find(string $id): ?Game
    {
        return $this->repository->find($id);
    }

    public function findAll()
    {
        return $this->repository->findAll();
    }

    public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null): ?array   {
        return $this->repository->findBy($criteria, $orderBy, $limit, $offset);
    }
}