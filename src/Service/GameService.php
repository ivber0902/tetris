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
        string $playerId,
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
            ->setPlayerId($playerId)
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
        $this->repository->store($game);
    }

    public function getRating(int $count, string $orderedBy, array $filters = []): ?array
    {
        return $this->repository->findBy($filters, [$orderedBy => -1], $count);
    }

    public function findGames(): array
    {
        return $this->repository->findAll();
    }

    public function serializeGameInfoToArray(Game $game): array
    {
        if ($game instanceof SingleGame) {
            return [
                'id' => $game->getId(),
                'player_id' => $game->getPlayerId(),
                'mode' => $game->getMode(),
                'time' => $game->getTime(),
                'score' => $game->getScore(),
                'tetris_count' => $game->getTetrisCount(),
                'figure_count' => $game->getFigureCount(),
                'filled_rows' => $game->getFilledRows(),
                'field_mode' => $game->getFieldMode(),
                'is_won' => $game->isWon(),
            ];
        } elseif ($game instanceof MultiplayerGame) {
            return [
                'id' => $game->getId(),
                'mode' => $game->getMode(),
                'time' => $game->getTime(),
                'difficulty' => $game->getDifficulty(),
                'players' => array_map(function (PlayerGameResults $player) {
                    return [
                        'id' => $player->getId(),
                        'score' => $player->getScore(),
                        'time' => $player->getTime(),
                        'tetris_count' => $player->getTetrisCount(),
                        'figure_count' => $player->getFigureCount(),
                        'filled_rows' => $player->getFilledRows(),
                        'is_won' => $player->getIsWon(),
                        'play_field' => $player->getPlayField(),
                    ];
                }, $game->getPlayers()),
            ];
        }
        return [];
    }
}