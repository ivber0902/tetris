package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

type PlayerConnection struct {
	conn   *websocket.Conn
	send   chan *Lobby
	lobby  *LobbyConnection
	ip     string
	id     int32
	isOpen bool
}

func (player *PlayerConnection) readLoop() {
	defer func() {
		player.conn.Close()
		player.isOpen = false
		log.Printf("Player %d (IP=%s) reading: Web socket closed", player.id, player.ip)

		go player.waitConnection()
	}()

	var request UpdateJSONRequest

	for {
		err := player.conn.ReadJSON(&request)
		if err != nil {
			switch err := err.(type) {
			case *websocket.CloseError:
				switch err.Code {
				case websocket.CloseNormalClosure,
					websocket.CloseGoingAway,
					websocket.CloseNoStatusReceived:
					log.Printf("Web socket closed by client: %s", err)
					return
				}
			case *json.SyntaxError:
				log.Println("JSON Unmarshal error:", err)
			case error:
				log.Println("JSON Reading error:", err)
				return
			}

		} else {
			switch request.Type {
			case GetRequestType:
				player.lobby.update <- player.lobby.info
			case UpdateRequestType:
				if player.ip == player.lobby.hostIP {
					player.lobby.info = &request.Updates
					player.lobby.update <- player.lobby.info
				}
			case ConnectRequestType:
				if id := request.Connection.PlayerID; id != 0 {
					player.lobby.info.AddPlayer(id)
					player.id = id
					player.lobby.update <- player.lobby.info
				}
			case DisconnectRequestType:
				if id := request.Connection.PlayerID; player.ip == player.lobby.hostIP && id != 0 {
					if disconnectedPlayer := player.lobby.getPlayerByID(id); disconnectedPlayer != nil {
						player.lobby.disconnect <- disconnectedPlayer
						player.lobby.update <- player.lobby.info
					}
				}
			case GameRunRequestType:
				if player.ip == player.lobby.hostIP {
					player.lobby.info.GameRun = true
					player.lobby.update <- player.lobby.info
				}
			}
		}
	}
}

func (player *PlayerConnection) writeLoop() {
	defer func() {
		player.conn.Close()
		log.Println("WRITE: Web socket closed by client")
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

func (player *PlayerConnection) waitConnection() {
	connectTimer := time.After(15 * time.Second)

	for !player.isOpen {
		select {
		case <-connectTimer:
			player.lobby.disconnect <- player
			return
		default:
			time.Sleep(1 * time.Second)
		}
	}
}
