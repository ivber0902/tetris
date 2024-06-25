<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

class UserRepository
{
    private EntityRepository $repository;
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
        $this->repository = $entityManager->getRepository(User::class);
    }

    public function store(User $user): int
    {
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return $user->getId();
    }

    public function delete(User $user): void
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }

    public function find(int $id): ?User
    {
        return $this->entityManager->find(User::class, $id);
    }

    public function findByLogin(string $login): ?User {
        return $this->repository->findOneBy(['login' => $login]);
    }
}
