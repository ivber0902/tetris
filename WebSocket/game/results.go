package game

import "WebSocket/connection"

type PlayerResult struct {
	PlayerID connection.ClientIDType `json:"player_id"`
	Score    int                     `json:"score"`
}

type Results []PlayerResult

func (g *Results) Add(state *State) {
	*g = append(*g, PlayerResult{
		PlayerID: state.ID,
		Score:    state.Score,
	})
}
