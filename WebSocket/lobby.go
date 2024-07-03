package main

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"os"
)

type Lobby struct {
	ID       int32         `bson:"_id"`
	Players  []int32       `bson:"players,omitempty" json:"players,omitempty"`
	Settings LobbySettings `bson:"settings,omitempty" json:"settings,omitempty"`
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

func (lobby *Lobby) Init(id int32) {
	lobby.ID = id
	lobby.Players = []int32{id}
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

func (lobby *Lobby) Insert() error {
	lobbyTable := DB.Collection("lobby")
	_, err := lobbyTable.InsertOne(context.TODO(), lobby)
	return err
}

func (lobby *Lobby) Update() error {
	lobbyTable := DB.Collection("lobby")
	_, err := lobbyTable.ReplaceOne(
		context.TODO(),
		bson.M{"_id": lobby.ID},
		lobby,
	)
	return err
}

func (lobby *Lobby) AddPlayer(playerID int32) error {
	lobbyTable := DB.Collection("lobby")

	for _, player := range lobby.Players {
		if player == playerID {
			return nil
		}
	}

	_, err := lobbyTable.UpdateOne(
		context.TODO(),
		bson.M{"_id": lobby.ID},
		bson.M{"$set": bson.M{"players": append(lobby.Players, playerID)}},
	)
	if err != nil {
		return err
	}

	err = lobby.Find(lobby.ID)

	return err
}

func (lobby *Lobby) RemovePlayer(playerID int32) error {
	lobbyTable := DB.Collection("lobby")

	for i, player := range lobby.Players {
		if player == playerID {
			_, err := lobbyTable.UpdateOne(
				context.TODO(),
				bson.M{"_id": lobby.ID},
				bson.M{"$set": bson.M{"players": append(lobby.Players[:i], lobby.Players[i+1:]...)}},
			)
			if err != nil {
				return err
			}
			break
		}
	}

	err := lobby.Find(lobby.ID)

	return err
}

func (lobby *Lobby) Find(id int32) error {
	lobbyTable := DB.Collection("lobby")
	err := lobbyTable.FindOne(context.TODO(), bson.M{"_id": id}).Decode(lobby)
	return err
}

func (lobby *Lobby) Delete() error {
	lobbyTable := DB.Collection("lobby")
	_, err := lobbyTable.DeleteOne(context.TODO(), bson.M{"_id": lobby.ID})
	return err
}
