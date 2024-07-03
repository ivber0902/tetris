package main

import (
	"log"
	"net/http"
)

type Player struct {
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

	var player Player

	for {
		err := conn.ReadJSON(&player)
		if err != nil {
			log.Println("JSON reading error", err)
		} else {
			ConnectToLobby(player)
		}
	}
}

func ConnectToLobby(player Player) {
	log.Printf("Lobby: %d", player.PlayerID)
}
