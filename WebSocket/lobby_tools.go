package main

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

func ConnectToLobby(request ConnectionJSONRequest) error {
	loadEnv()

	// Connect to database
	dbURI := os.Getenv("DATABASE_URI")
	opt := options.Client().ApplyURI(dbURI)
	client, err := mongo.Connect(context.TODO(), opt)
	if err != nil {
		panic(err)
	}
	lobbyTable := client.Database("tetris").Collection("lobby")

	if request.LobbyID == 0 {
		request.LobbyID = request.PlayerID
	}

	var lobby Lobby
	err = lobbyTable.FindOne(context.TODO(), bson.D{{"_id", request.LobbyID}}).Decode(&lobby)
	if errors.Is(err, mongo.ErrNoDocuments) {
		err = CreateLobby(request, lobbyTable)
		return err
	} else if err != nil {
		return err
	}

	for _, playerID := range lobby.Players {
		if playerID == request.PlayerID {
			return nil
		}
	}

	lobby.Players = append(lobby.Players, request.PlayerID)
	_, err = lobbyTable.UpdateOne(
		context.TODO(),
		bson.D{{"_id", request.LobbyID}},
		bson.D{{"$set", bson.D{{"players", lobby.Players}}}},
	)

	if err == nil {
		log.Printf("Player %d connected to Lobby %d", request.PlayerID, lobby.ID)
	}

	return err
}

func CreateLobby(request ConnectionJSONRequest, lobbyTable *mongo.Collection) error {
	return nil
}

func UpdateLobby(request UpdateJSONRequest) error {
	return nil
}

//func UpdateLobbyInfo(conn *websocket.Conn) error {
//
//}
