<?php

namespace App\Service;

use App\Document\Game;
use App\Document\SingleGame;
use App\Repository\GameRepository;

class GameService
{
    public function __construct(private readonly GameRepository $repository)
    {
    }

    public function find(string $id): Game|SingleGame|null
    {
        return $this->repository->find($id);
    }

    public function saveSingleGame(
        int $mode,
        int $time,
        int $score,
        int $tetrisCount,
        int $figureCount,
        int $filledRows,
        int $fieldMode,
        bool $isWon = false,
    ): string
    {
        $game = new SingleGame();
        $game
            ->setMode($mode)
            ->setTime($time)
            ->setScore($score)
            ->setTetrisCount($tetrisCount)
            ->setFigureCount($figureCount)
            ->setFilledRows($filledRows)
            ->setFieldMode($fieldMode)
            ->setIsWon($isWon);
        return $this->repository->store($game);
    }

    public function getRating(int $count, string $orderedBy): ?array
    {
        return $this->repository->findBy([], [$orderedBy => -1], $count);
    }

    public function findGames(): array
    {
        return $this->repository->findAll();
    }
}