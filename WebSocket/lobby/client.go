package lobby

import (
	"WebSocket/connection"
	"log"
	"time"
)

func HandleRequest(player *connection.Client[Config, Config, Config], request connection.Request[Config]) bool {
	switch request.Type {
	case GetRequestType:
	case UpdateRequestType:
		if player.IsHost && request.Update != nil {
			player.Config.UpdateSettings(request.Update)
			log.Printf("Player (ID: %s) reading: host update lobby info %s", player.ID, player.Config.ID)
		}
	case ConnectRequestType:
		if id := request.Credentials.PlayerID; id != "" {
			player.Config.AddPlayer(id)
			player.ID = id

			log.Printf("Player (ID: %s) reading: connect to lobby %s", player.ID, player.Config.ID)
		}
	case DisconnectRequestType:
		if id := request.Credentials.PlayerID; player.IsHost && id != "" {
			player.Event.Disconnect <- id
		}
	case GameRunRequestType:
		if player.IsHost {
			player.Event.Next <- true
			return true
		}
	}
	player.Event.Update <- player.Config
	return true
}

func WaitConnection(player *connection.Client[Config, Config, Config]) {
	log.Printf("Player (ID: %s) waiting for connection to lobby", player.ID)

	var duration time.Duration
	if player.Config.GameRun {
		duration = time.Minute * 2
	} else {
		duration = time.Second * 5
	}

	connectTimer := time.After(duration)

	for !player.IsOpen {
		select {
		case <-connectTimer:
			player.Event.Disconnect <- player.ID
			log.Printf("Player (IP: %s) disconnected after waiting", player.ID)
			return
		default:
		}
	}
}
