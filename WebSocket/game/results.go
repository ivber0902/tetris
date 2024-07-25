package game

import (
	"WebSocket/connection"
	"WebSocket/database"
	"log"
	"time"
)

type PlayerResult struct {
	ID          connection.ClientIDType `json:"id" bson:"id"`
	Score       int                     `json:"score" bson:"score"`
	Time        int                     `json:"time" bson:"time"`
	TetrisCount int                     `json:"tetris_count" bson:"tetrisCount"`
	FigureCount int                     `json:"figure_count" bson:"figureCount"`
	FilledRows  int                     `json:"filled_rows" bson:"filledRows"`
	IsWon       bool                    `json:"is_won" bson:"isWon"`
	PlayField   [][]FigureType          `json:"play_field" bson:"playField"`
}

type Results struct {
	ID         string         `json:"id" bson:"id"`
	Mode       int            `json:"mode" bson:"mode"`
	Time       int            `json:"time" bson:"time"`
	Difficulty int8           `json:"difficulty" bson:"difficulty"`
	Players    []PlayerResult `json:"players" bson:"players"`
	Type       string         `json:"type" bson:"type"`
}

func (results *Results) Set(difficulty int8, time int) {
	results.Type = "multiplayerGame"
	results.Mode = 9
	results.Difficulty = difficulty
	results.Time = time
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

func (room *Room) SaveResults(results *Results) {
	go func() {
		log.Printf("Show Results for game %s", room.ID)
		time.Sleep(time.Hour)
		room.Events.Remove <- room
	}()
	err := database.Save(results)
	if err != nil {
		log.Println("Save result error:", err)
	}
}
