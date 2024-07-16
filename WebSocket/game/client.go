package game

import (
	"WebSocket/connection"
	"WebSocket/lobby"
	"log"
	"time"
)

func HandleRequest(room *Room, player *connection.Client[State, lobby.Config, Response], request connection.Request[State]) bool {
	switch request.Type {
	case ConfigRequestType:
		player.Send(&Response{
			Type:    "config",
			Config:  player.Config,
			Figures: *player.State.Figures,
		})
		log.Printf("Player %d (IP: %s) reading: got config %s", player.ID, player.IP, room.ID)
	case AllRequestType:
		for p := range room.Clients {
			if p.IsOpen {
				player.Send(&Response{
					Type:  "update",
					State: p.State,
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
		player.Send(&Response{
			Type:  "set",
			State: player.State,
		})
	case GameOverRequestType:
		player.State.GameOver = true
		room.Results.Add(player.State)
		room.GameEnd <- player.State
		player.Event.Update <- &Response{
			Type:  "update",
			State: player.State,
		}
		log.Printf("Player %d (IP: %s) game over", player.ID, player.IP)
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
