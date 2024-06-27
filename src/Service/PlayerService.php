<?php

namespace App\Service;

use App\Entity\Player;
use App\Repository\PlayerRepository;

class PlayerService
{
    public function __construct(private readonly PlayerRepository $playerRepository)
    {
    }

    public function addPlayer(?int $userId): int
    {
        $player = new Player();
        $player->setUserId($userId);
        return $this->playerRepository->store($player);
    }

    public function findPlayerById(int $id): ?Player
    {
        return $this->playerRepository->find($id);
    }

    public function updatePlayer(
        int $id,
        int $maxScore,
        int $averageScore,
        int $totalScore,
        int $gameCount,
        int $winCount,
        ?int $userId = null
    ): int
    {
        $player = $this->playerRepository->find($id);
        $player->setMaxScore($maxScore);
        $player->setAverageScore($averageScore);
        $player->setTotalScore($totalScore);
        $player->setGameCount($gameCount);
        $player->setWinCount($winCount);

        if ($userId !== null) {
            $player->setUserId($userId);
        }

        return $this->playerRepository->store($player);
    }

    public function updateStatistics(
        int $id,
        ?int $score,
        ?bool $isWon
    ): int
    {
        $player = $this->playerRepository->find($id);

        if ($isWon === null && $score !== null) {
            if ($player->getMaxScore() === null || $player->getMaxScore() < $score) {
                $player->setMaxScore($score);
            }

            if ($player->getAverageScore() === null) {
                $player->setAverageScore($score);
            } else {
                $player->setAverageScore(
                    ($player->getAverageScore() * $player->getGameCount() + $score) / ($player->getGameCount() + 1)
                );
            }
            $player->setTotalScore(($player->getTotalScore() ?? 0) + $score);
        }

        if ($isWon) {
            $player->setWinCount(($player->getWinCount() ?? 0) + 1);
        }
        $player->setGameCount(($player->getGameCount() ?? 0) + 1);

        return $this->playerRepository->store($player);
    }

    public function deletePlayer(Player $player): void
    {
        $this->playerRepository->delete($player);
    }
}