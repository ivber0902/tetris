<?php

namespace App\Service;

use App\Document\Game;
use App\Document\MultiplayerGame;
use App\Document\Player;
use App\Document\PlayerGameResults;
use App\Document\SingleGame;
use App\Repository\GameRepository;

class GameService
{
    public function __construct(
        private readonly GameRepository $repository,
        private readonly PlayerService $playerService,
    )
    {
    }

    public function find(string $id): Game|SingleGame|MultiplayerGame|null
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

    public function saveMultiplayerGame(
        int $mode,
        int $time,
    ): string
    {
        $game = new MultiplayerGame();
        $game
            ->setMode($mode)
            ->setTime($time);
        return $this->repository->store($game);
    }

    public function addPlayerToMultiplayerGame(
        string $gameId,
        string $playerId,
        int $score,
        int $time,
        int $tetrisCount,
        int $figureCount,
        int $filledRows,
        bool $isWon,
        array $playField,
    ): void
    {
        $game = $this->find($gameId);
        $results = new PlayerGameResults();
        $game->addPlayer(
            $results
                ->setId($playerId)
                ->setScore($score)
                ->setTime($time)
                ->setTetrisCount($tetrisCount)
                ->setFigureCount($figureCount)
                ->setFilledRows($filledRows)
                ->setPlayField($playField)
                ->setIsWon($isWon)
        );
        $this->playerService->updateStatistics(
            $playerId,
            $score,
            $isWon
        );
        $this->playerService->addGame($playerId, $gameId);
        $this->repository->store($game);
    }

    public function getRating(int $count, string $orderedBy): ?array
    {
        return $this->repository->findBy([], [$orderedBy => -1], $count);
    }

    public function findGames(): array
    {
        return $this->repository->findAll();
    }

    public function serializePlayerInfoToJSON(Player $player): array
    {
        $statistics = $player->getStatistics();
        return [
            "id" => $player->getId(),
            "login" => $player->getLogin(),
            "avatar" => $player->getAvatar(),
            "statistics" => [
                "last_score" => $statistics->getLastScore(),
                "total_score" => $statistics->getTotalScore(),
                "max_score" => $statistics->getMaxScore(),
                "game_count" => $statistics->getGameCount(),
                "win_count" => $statistics->getWinCount(),
            ],
        ];
    }
}