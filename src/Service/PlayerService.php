<?php

namespace App\Service;

use App\Document\Player;
use App\Document\User;
use App\Repository\PlayerRepository;
use App\Service\Input\RegisterUserInputInterface;

class PlayerService
{
    public function __construct(
        private readonly PlayerRepository $playerRepository,
        private readonly PasswordHasher $passwordHasher,
        private readonly GameService $gameService,
    )
    {
    }

    public function addPlayer(string $login, string $password): string
    {
        $player = new Player();
        $player->setLogin($login);
        $player->setPassword($password);

        return $this->playerRepository->store($player);
    }

    public function updateUser(string $id, string $login, string $password): string
    {
        $user = $this->playerRepository->find($id);
        $user->setLogin($login);
        $user->setPassword($password);

        return $this->playerRepository->store($user);
    }

    public function findUserByLogin(string $login): ?User
    {
        return $this->playerRepository->findByLogin($login)?->getUser();
    }

    public function findPlayerByLogin(string $login): ?Player
    {
        return $this->playerRepository->findByLogin($login);
    }

    public function findPlayer(string $id): ?Player
    {
        return $this->playerRepository->find($id);
    }

    public function updateAvatarPath(string $avatarPath, string $id): string
    {
        $player = $this->playerRepository->find($id);
        $player->setAvatar($avatarPath);
        return $this->playerRepository->store($player);
    }

    public function addGame(string $playerId, string $gameId): void
    {
        $game = $this->gameService->find($gameId);
        $player = $this->playerRepository->find($playerId);
        $player->addGame($game);
        $this->playerRepository->store($player);
    }

    public function setStatistics(
        string $id,
        int $maxScore,
        int $totalScore,
        int $gameCount,
        int $winCount,
        int $lastScore,
    ): ?int
    {
        $player = $this->playerRepository->find($id);

        if ($player === null) {
            return null;
        }

        $player->getStatistics()
            ->setMaxScore($maxScore)
            ->setTotalScore($totalScore)
            ->setGameCount($gameCount)
            ->setWinCount($winCount)
            ->setLastScore($lastScore);

        return $this->playerRepository->store($player);
    }

    public function updateStatistics(
        string $id,
        ?int $score,
        ?bool $isWon
    ): string
    {
        $player = $this->playerRepository->find($id);

        if ($isWon === null && $score !== null) {
            if ($player->getStatistics()->getMaxScore() === null || $player->getStatistics()->getMaxScore() < $score) {
                $player->getStatistics()->setMaxScore($score);
            }

            $player->getStatistics()->setTotalScore(($player->getStatistics()->getTotalScore() ?? 0) + $score);
            $player->getStatistics()->setLastScore($score);
        }

        if ($isWon) {
            $player->getStatistics()->setWinCount(($player->getStatistics()->getWinCount() ?? 0) + 1);
        }
        $player->getStatistics()->setGameCount(($player->getStatistics()->getGameCount() ?? 0) + 1);

        return $this->playerRepository->store($player);
    }

    public function deletePlayer(Player $player): void
    {
        $this->playerRepository->delete($player);
    }

    public function register(RegisterUserInputInterface $input): string
    {
        $user = $this->findUserByLogin($input->getLogin());
        if ($user !== null) {
            throw new \InvalidArgumentException("Пользователь с логином \"" . $input->getLogin() . "\" уже зарегистрирован");
        }

        return $this->addPlayer(
            $input->getLogin(),
            $this->passwordHasher->hash($input->getPassword())
        );
    }

    public function getRating(int $count, string $orderedBy): ?array
    {
        return $this->playerRepository->findBy([], [$orderedBy => -1], $count);
    }
}