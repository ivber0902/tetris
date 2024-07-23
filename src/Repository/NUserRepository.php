<?php

namespace App\Repository;

use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

class NUserRepository
{
    private DocumentRepository $repository;
    public function __construct(
        private readonly DocumentManager $documentManager,
    ) {
        $this->repository = $documentManager->getRepository(User::class);
    }

    public function create(string $login, string $password): string {
        $user = new User();
        $user->setLogin($login);
        $user->setPassword($password);

        $this->documentManager->persist($user);
        $this->documentManager->flush();
        return $user->getId();
    }

    public function findByLogin(string $login): User
    {
        return $this->repository->findOneBy(['login' => $login]);
    }

    public function findById(string $id): User
    {
        return $this->repository->find($id);
    }

    public function findAll(): array
    {
        return $this->repository->findAll();
    }
}