package main

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"os"
)

type ConnectionJSONRequest struct {
	LobbyID  int32 `json:"lobby_id"`
	PlayerID int32 `json:"player_id"`
}

func ConnectToLobbyHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := conn.Close(); err != nil {
			panic(err)
		}
	}()

	var request ConnectionJSONRequest

	for {
		err := conn.ReadJSON(&request)
		if err != nil {
			log.Println("JSON reading error", err)
		} else {
			err = ConnectToLobby(request)
			log.Println("Connect to lobby error:", err)
		}
	}
}

func ConnectToLobby(request ConnectionJSONRequest) error {
	loadEnv()
	log.Println("Connecting to lobby", request.LobbyID)

	// Connect to database
	dbURI := os.Getenv("DATABASE_URI")
	opt := options.Client().ApplyURI(dbURI)
	client, err := mongo.Connect(context.TODO(), opt)
	if err != nil {
		panic(err)
	}
	lobbyTable := client.Database("tetris").Collection("lobby")

	log.Printf("lobby id: %v player id: %v\n", request.LobbyID, request.PlayerID)
	if request.LobbyID == 0 {
		request.LobbyID = request.PlayerID
	}
	log.Printf("after test => lobby id: %v player id: %v\n", request.LobbyID, request.PlayerID)
	var lobby Lobby
	err = lobbyTable.FindOne(context.TODO(), bson.D{{"_id", request.LobbyID}}).Decode(&lobby)
	if errors.Is(err, mongo.ErrNoDocuments) {
		err = CreateLobby(request, lobbyTable)
		return err
	} else if err != nil {
		return err
	}
	for _, playerID := range lobby.Players {
		log.Println(playerID)
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
	return err
}

func CreateLobby(request ConnectionJSONRequest, lobbyTable *mongo.Collection) error {
	log.Println("Creating lobby", request.LobbyID)

	lobby, err := loadDefaultLobby()
	if err != nil {
		return err
	}
	lobby.ID = request.PlayerID
	lobby.Players = append(lobby.Players, request.PlayerID)

	_, err = lobbyTable.InsertOne(context.TODO(), lobby)
	if err != nil {
		return err
	}
	return nil
}
