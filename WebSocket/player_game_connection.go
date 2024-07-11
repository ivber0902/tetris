package main

import (
	"WebSocket/game"
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

type PlayerGameConnection struct {
	conn    *websocket.Conn
	send    chan *GameUpdateResponse
	game    *GameConnection
	ip      string
	id      int32
	isOpen  bool
	state   *game.Game
	gameEnd chan *game.Game
}

func (player *PlayerGameConnection) readLoop() {
	defer func() {
		player.conn.Close()
		player.isOpen = false
		log.Printf("Player %d (IP: %s) reading: Web socket closed", player.id, player.ip)

		go player.waitConnection()
	}()

	var request UpdateGameJSONRequest

	for {
		err := player.conn.ReadJSON(&request)
		if err != nil {
			switch err := err.(type) {
			case *websocket.CloseError:
				switch err.Code {
				case websocket.CloseNormalClosure,
					websocket.CloseGoingAway,
					websocket.CloseNoStatusReceived:
					log.Printf("Player Game %d (IP: %s) reading: Web socket closed by client", player.id, player.ip)
					return
				}
			case *json.SyntaxError:
				log.Printf("Player Game %d (IP: %s) reading: JSON Unmarshal error: %v", player.id, player.ip, err)
			case error:
				log.Printf("Player Game %d (IP: %s) reading: JSON reading error: %v", player.id, player.ip, err)
				return
			}

		} else {
			switch request.Type {
			case "config":
				player.send <- &GameUpdateResponse{
					Type:   "config",
					Config: player.game.config,
				}
				log.Printf("Player %d (IP: %s) reading: got config %s", player.id, player.ip, player.game.id)
			case "all":
				for p := range player.game.players {
					select {
					case player.send <- &GameUpdateResponse{
						Type:  "update",
						State: p.state,
					}:
					}
				}
			case "update":
				*player.state = request.Updates
				player.game.update <- &GameUpdateResponse{
					Type:  "update",
					State: player.state,
				}
			case "set":
				player.state.NextFigure()
				player.send <- &GameUpdateResponse{
					Type:  "update",
					State: player.state,
				}
			case "game_over":
				player.state.GameOver = true
				player.gameEnd <- player.state
				player.game.update <- &GameUpdateResponse{
					Type:  "update",
					State: player.state,
				}
			}
		}
	}
}

func (player *PlayerGameConnection) writeLoop() {
	defer func() {
		player.conn.Close()
		log.Printf("Player %d (IP: %s) writing: Web socket closed by client", player.id, player.ip)
	}()
	for {
		select {
		case updatedLobby, ok := <-player.send:
			if !ok {
				player.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			player.conn.WriteJSON(updatedLobby)
		}
	}
}

func (player *PlayerGameConnection) waitConnection() {
	log.Printf("Player %d (IP: %s) waiting for connection to game %s", player.id, player.ip, player.game.id)
	connectTimer := time.After(15 * time.Second)

	for !player.isOpen {
		select {
		case <-connectTimer:
			player.game.disconnect <- player
			log.Printf("Player %d (IP: %s) disconnected after waiting", player.id, player.ip)
			return
		default:
			time.Sleep(1 * time.Second)
		}
	}
}
