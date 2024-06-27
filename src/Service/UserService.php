<?php


namespace App\Service;

use App\Controller\Input\RegisterUserInput;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\Input\RegisterUserInputInterface;

class UserService {
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly PlayerService  $playerService,
        private readonly PasswordHasher $passwordHasher
    )
    {

    }

    public function addUser(string $login, string $password): int
    {
        $user = new User();
        $user->setLogin($login);
        $user->setPassword($password);

        $userId = $this->userRepository->store($user);
        $playerId = $this->playerService->addPlayer($userId);
        $user->setPlayerId($playerId);
        return $this->userRepository->store($user);
    }

    public function updateUser(int $id, string $login, string $password): int
    {
        $user = $this->userRepository->find($id);
        $user->setLogin($login);
        $user->setPassword($password);

        return $this->userRepository->store($user);
    }

    public function findUser(int $id): ?User
    {
        return $this->userRepository->find($id);
    }

    public function findUserByLogin(string $login): ?User {
        return $this->userRepository->findByLogin($login);
    }

    public function deleteUser(User $user): void
    {
        $this->playerService->deletePlayer($user->getPlayer());
        $this->userRepository->delete($user);
    }

    public function deleteUserById(int $id): void
    {
        $user = $this->userRepository->find($id);
        $this->playerService->deletePlayer($user->getPlayer());
        $this->userRepository->delete($user);
    }

    public function register(RegisterUserInputInterface $input): int
    {
        $user = $this->findUserByLogin($input->getLogin());
        if ($user !== null) {
            throw new \InvalidArgumentException("Пользователь с логином \"" . $input->getLogin() . "\" уже зарегистрирован");
        }

        return $this->addUser(
            $input->getLogin(),
            $this->passwordHasher->hash($input->getPassword())
        );
    }
}