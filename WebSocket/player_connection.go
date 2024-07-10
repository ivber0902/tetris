package main

import (
	"WebSocket/lobby"
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

type PlayerConnection struct {
	conn   *websocket.Conn
	send   chan *lobby.Lobby
	lobby  *LobbyConnection
	ip     string
	id     int32
	isOpen bool
}

func (player *PlayerConnection) readLoop() {
	defer func() {
		player.conn.Close()
		player.isOpen = false
		log.Printf("Player %d (IP: %s) reading: Web socket closed", player.id, player.ip)

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
					log.Printf("Player %d (IP: %s) reading: Web socket closed by client", player.id, player.ip)
					return
				}
			case *json.SyntaxError:
				log.Printf("Player %d (IP: %s) reading: JSON Unmarshal error: %v", player.id, player.ip, err)
			case error:
				log.Printf("Player %d (IP: %s) reading: JSON reading error: %v", player.id, player.ip, err)
				return
			}

		} else {
			switch request.Type {
			case GetRequestType:
				player.lobby.update <- player.lobby.info
				log.Printf("Player %d (IP: %s) reading: got lobby info %s", player.id, player.ip, player.lobby.id)
			case UpdateRequestType:
				if player.ip == player.lobby.hostIP {
					player.lobby.info = &request.Updates
					player.lobby.update <- player.lobby.info
					log.Printf("Player %d (IP: %s) reading: host update lobby info %s", player.id, player.ip, player.lobby.id)
				}
			case ConnectRequestType:
				if id := request.Connection.PlayerID; id != 0 {
					player.lobby.info.AddPlayer(id)
					player.id = id
					player.lobby.update <- player.lobby.info

					log.Printf("Player %d (IP: %s) reading: connect to lobby %s", player.id, player.ip, player.lobby.id)
				}
			case DisconnectRequestType:
				if id := request.Connection.PlayerID; player.ip == player.lobby.hostIP && id != 0 {
					if disconnectedPlayer := player.lobby.getPlayerByID(id); disconnectedPlayer != nil {
						player.lobby.disconnect <- disconnectedPlayer

						log.Printf("Player %d (IP: %s) reading: disconnect from lobby %s", player.id, player.ip, player.lobby.id)
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

func (player *PlayerConnection) waitConnection() {
	log.Printf("Player %d (IP: %s) waiting for connection to lobby %s", player.id, player.ip, player.lobby.id)
	connectTimer := time.After(15 * time.Second)

	for !player.isOpen {
		select {
		case <-connectTimer:
			player.lobby.disconnect <- player
			log.Printf("Player %d (IP: %s) disconnected after waiting", player.id, player.ip)
			return
		default:
			time.Sleep(1 * time.Second)
		}
	}
}
