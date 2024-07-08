package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
)

type PlayerConnection struct {
	conn  *websocket.Conn
	send  chan *Lobby
	lobby *LobbyConnection
	ip    string
}

func (player *PlayerConnection) readLoop() {
	defer func() {
		player.conn.Close()
		log.Println("READ: Web socket closed by client")
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
			}

		} else if request.Type == GetRequestType {
			player.lobby.update <- player.lobby.info
		} else if request.Type == UpdateRequestType {
			if player.ip == player.lobby.hostIP {
				player.lobby.info = &request.Updates
				player.lobby.update <- player.lobby.info
			}
		} else if request.Type == ConnectRequestType {
			if id := request.Connection.PlayerID; id != 0 {
				player.lobby.info.AddPlayer(id)
				player.lobby.update <- player.lobby.info
			}
		} else if request.Type == DisconnectRequestType {
			if player.ip == player.lobby.hostIP && request.Connection.PlayerID != 0 {
				player.lobby.disconnect <- player
				player.lobby.update <- player.lobby.info
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
