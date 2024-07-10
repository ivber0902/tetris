package main

import (
	"WebSocket/lobby"
	"github.com/gorilla/websocket"
	"log"
)

type LobbyList struct {
	conn   map[*websocket.Conn]bool
	new    chan *lobby.Lobby
	update chan *lobby.Lobby
	remove chan *lobby.Lobby
	list   []*lobby.Lobby
}

type LobbyListUpdateMessage struct {
	Type  string       `json:"type"`
	Lobby *lobby.Lobby `json:"lobby"`
}

const (
	NewLobbyListUpdateMessage    = "new"
	UpdateLobbyListUpdateMessage = "update"
	RemoveLobbyListUpdateMessage = "remove"
)

func (l *LobbyList) Init() {
	l.conn = make(map[*websocket.Conn]bool)
	l.new = make(chan *lobby.Lobby)
	l.update = make(chan *lobby.Lobby)
	l.remove = make(chan *lobby.Lobby)
}

func (l *LobbyList) Listen() {
	log.Println("Start LobbyList listening")
	for {
		select {
		case lobby, ok := <-l.new:
			if !ok {
				for conn := range l.conn {
					conn.WriteMessage(websocket.CloseMessage, []byte{})
					conn.Close()
				}
				return
			}
			l.list = append(l.list, lobby)
			for conn := range l.conn {
				conn.WriteJSON(LobbyListUpdateMessage{
					Type:  NewLobbyListUpdateMessage,
					Lobby: lobby,
				})
			}
			log.Printf("LobbyList: new lobby %s", lobby.ID)
		case lobby, ok := <-l.update:
			if ok {
				for conn := range l.conn {
					conn.WriteJSON(LobbyListUpdateMessage{
						Type:  UpdateLobbyListUpdateMessage,
						Lobby: lobby,
					})
				}
				log.Printf("LobbyList: update lobby %s", lobby.ID)
			}
		case lobby, ok := <-l.remove:
			if ok {
				for i := range l.list {
					if l.list[i] == lobby {
						l.list = append(l.list[:i], l.list[i+1:]...)
					}
				}
				for conn := range l.conn {
					conn.WriteJSON(LobbyListUpdateMessage{
						Type:  RemoveLobbyListUpdateMessage,
						Lobby: lobby,
					})
				}
				log.Printf("LobbyList: remove lobby %s", lobby.ID)
			}
		}
	}
}

func (l *LobbyList) AddConnection(conn *websocket.Conn) {
	l.conn[conn] = true
}

func (l *LobbyList) ListenConnection(conn *websocket.Conn) {
	for {
		msgType, msg, err := conn.ReadMessage()
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
			}
		} else if msgType == websocket.TextMessage {
			if string(msg) == "get" {
				l.SendAll(conn)
			}
		}
	}
}

func (l *LobbyList) SendAll(conn *websocket.Conn) {
	for _, lobby := range l.list {
		conn.WriteJSON(LobbyListUpdateMessage{
			Type:  UpdateLobbyListUpdateMessage,
			Lobby: lobby,
		})
	}
}
