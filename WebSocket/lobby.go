package main

import (
	"encoding/json"
	"os"
)

type Lobby struct {
	ID       string        `bson:"_id" json:"id"`
	Players  []int32       `bson:"players,omitempty" json:"players,omitempty"`
	Settings LobbySettings `bson:"settings,omitempty" json:"settings,omitempty"`
	GameRun  bool          `bson:"game_run,omitempty" json:"game_run,omitempty"`
}

type LobbySettings struct {
	Music      string `bson:"music,omitempty" json:"music,omitempty"`
	Background string `bson:"background,omitempty" json:"background,omitempty"`
	Difficulty int8   `bson:"difficulty,omitempty" json:"difficulty,omitempty"`

	PlayField LobbyPlayFieldSettings `bson:"play_field,omitempty" json:"play_field,omitempty"`
}

type LobbyPlayFieldSettings struct {
	Width  int8 `bson:"width,omitempty" json:"width,omitempty"`
	Height int8 `bson:"height,omitempty" json:"height,omitempty"`
}

func (lobby *Lobby) Init(lobbyID string) {
	lobby.ID = lobbyID
}

func (lobby *Lobby) SetDefault() error {
	file, err := os.Open("default-lobby.json")
	if err != nil {
		return err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	decoder := json.NewDecoder(file)

	err = decoder.Decode(&lobby)
	return err
}

func (lobby *Lobby) AddPlayer(playerID int32) {
	for _, player := range lobby.Players {
		if player == playerID {
			return
		}
	}

	lobby.Players = append(lobby.Players, playerID)
}

func (lobby *Lobby) RemovePlayer(playerID int32) {
	for i, player := range lobby.Players {
		if player == playerID {
			lobby.Players = append(lobby.Players[:i], lobby.Players[i+1:]...)
		}
	}
}
