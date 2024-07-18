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
			*player.Config = *request.Update
			log.Printf("Player %d (IP: %s) reading: host update lobby info %s", player.ID, player.IP, player.Config.ID)
		}
	case ConnectRequestType:
		if id := request.Credentials.PlayerID; id != 0 {
			player.Config.AddPlayer(id)
			player.ID = id

			log.Printf("Player %d (IP: %s) reading: connect to lobby %s", player.ID, player.IP, player.Config.ID)
		}
	case DisconnectRequestType:
		if id := request.Credentials.PlayerID; player.IsHost && id != 0 {
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
	log.Printf("Player %d (IP: %s) waiting for connection to lobby", player.ID, player.IP)

	var duration time.Duration
	if player.Config.GameRun {
		duration = time.Second * 30
	} else {
		duration = time.Second * 5
	}

	connectTimer := time.After(duration)

	for !player.IsOpen {
		select {
		case <-connectTimer:
			player.Event.Disconnect <- player.ID
			log.Printf("Player %d (IP: %s) disconnected after waiting", player.ID, player.IP)
			return
		default:
		}
	}
}
