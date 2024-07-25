package game

import "WebSocket/connection"

type PlayerResult struct {
	ID          connection.ClientIDType `json:"id"`
	Score       int                     `json:"score"`
	Time        int                     `json:"time"`
	TetrisCount int                     `json:"tetris_count"`
	FigureCount int                     `json:"figure_count"`
	FilledRows  int                     `json:"filled_rows"`
	IsWon       bool                    `json:"is_won"`
	PlayField   [][]FigureType          `json:"play_field"`
}

type Results struct {
	ID         string         `json:"id"`
	Mode       int            `json:"mode"`
	Time       int            `json:"time"`
	Difficulty int            `json:"difficulty"`
	Players    []PlayerResult `json:"players"`
}

func (results *Results) AddPlayer(state *State, isWon bool) {
	results.Players = append([]PlayerResult{{
		ID:          state.ID,
		Score:       state.Score,
		Time:        0,
		TetrisCount: 0,
		FigureCount: state.FigureCount,
		FilledRows:  0,
		IsWon:       isWon,
		PlayField:   state.PlayField,
	}}, results.Players...)
}
