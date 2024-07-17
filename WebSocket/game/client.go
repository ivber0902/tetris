package game

import (
	"WebSocket/connection"
	"WebSocket/lobby"
	"log"
	"math/rand"
	"time"
)

func HandleRequest(room *Room, player *connection.Client[State, lobby.Config, Response], request connection.Request[State]) bool {
	switch request.Type {
	case ConfigRequestType:
		player.Send(&Response{
			Type:    "config",
			Config:  player.Config,
			Figures: (*player.State.Figures)[1:],
		})
		log.Printf("Player %d (IP: %s) reading: got config %s", player.ID, player.IP, room.ID)
	case StartRequestType:
		if player.IsHost {
			player.State.Started = true
			player.Event.Update <- &Response{
				Type: "start",
			}
		}
	case AllRequestType:
		for client := range room.Clients {
			if client.IsOpen {
				player.Send(&Response{
					Type:  "state",
					State: client.State,
				})
			}
		}
	case UpdateRequestType:
		player.State.Update(request.Update)
		player.Event.Update <- &Response{
			Type:  "update",
			State: player.State,
		}
	case SetRequestType:
		player.State.NextFigure()
	case RowRequestType:
		switch request.Info.(type) {
		case float64:
			client := getRandomClient(room.Clients)
			if client != nil {
				client.Send(&Response{
					Type: "add_rows",
					Info: AddRowInfo{
						int(request.Info.(float64)),
						rand.Intn(int(player.Config.Settings.PlayField.Width)),
					},
				})
			}
		}
	case GameOverRequestType:
		if !player.State.GameOver {
			player.State.GameOver = true
			room.GameEnd <- player.State
			player.Event.Update <- &Response{
				Type:  "update",
				State: player.State,
			}
			log.Printf("Player %d (IP: %s) game over", player.ID, player.IP)
		}
	}
	return true
}

func WaitConnection(player *connection.Client[State, lobby.Config, Response]) {
	log.Printf("Player %d (IP: %s) waiting for connection to game", player.ID, player.IP)
	connectTimer := time.After(15 * time.Second)

	for !player.IsOpen {
		select {
		case <-connectTimer:
			if player.Event != nil {
				player.Event.Disconnect <- player.ID
			}
			log.Printf("Player %d (IP: %s) disconnected after waiting", player.ID, player.IP)
			return
		default:
			time.Sleep(1 * time.Second)
		}
	}
}

func getRandomClient(clients map[*connection.Client[State, lobby.Config, Response]]bool) *connection.Client[State, lobby.Config, Response] {
	counter := 0
	active := make(map[*connection.Client[State, lobby.Config, Response]]bool)

	for client := range clients {
		if client.IsOpen {
			active[client] = true
		}
	}

	clientOrder := rand.Intn(len(active))
	for client := range active {
		if clientOrder == counter {
			return client
		}
	}
	return nil
}
