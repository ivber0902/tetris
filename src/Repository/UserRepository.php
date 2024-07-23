<?php

namespace App\Repository;

use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

class UserRepository
{
    private DocumentRepository $repository;
    public function __construct(private readonly DocumentManager $documentManager)
    {
        $this->repository = $documentManager->getRepository(User::class);
    }

    public function store(User $user): int
    {
        $this->documentManager->persist($user);
        $this->documentManager->flush();
        return $user->getId();
    }

    public function delete(User $user): void
    {
        $this->documentManager->remove($user);
        $this->documentManager->flush();
    }

    public function find(string $id): ?User
    {
        return $this->documentManager->find(User::class, $id);
    }

    public function findByLogin(string $login): ?User {
        return $this->repository->findOneBy(['login' => $login]);
    }

    public function findByPlayerId(int $playerId): ?User {
        return $this->repository->findOneBy(['playerId' => $playerId]);
    }
}
