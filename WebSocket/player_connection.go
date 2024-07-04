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
}

func (player *PlayerConnection) readLoop() {
	defer func() {
		player.lobby.disconnect <- player
		player.conn.Close()
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

		} else if request.Type == UpdateRequestType {
			player.lobby.info = &request.Updates
			player.lobby.update <- player.lobby.info
		} else if request.Type == GetRequestType {
			player.lobby.update <- player.lobby.info
		} else if request.Type == ConnectRequestType {
			if id := request.Connection.PlayerID; id != 0 {
				err := player.lobby.info.AddPlayer(id)
				if err != nil {
					log.Println("Error connect player to lobby:", err)
				}
				player.lobby.update <- player.lobby.info
			}
		}
	}
}

func (player *PlayerConnection) writeLoop() {
	defer player.conn.Close()
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
