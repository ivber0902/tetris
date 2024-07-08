package main

import (
	"github.com/gorilla/websocket"
	"log"
)

type LobbyList struct {
	conn map[*websocket.Conn]bool
	new  chan *Lobby
	list []*Lobby
}

func (l *LobbyList) Listen() {
	l.new = make(chan *Lobby)
	l.conn = make(map[*websocket.Conn]bool)
	for {
		log.Println("Listening lobby")
		select {
		case lobby, ok := <-l.new:
			log.Println("New lobby: ", lobby)
			if !ok {
				for conn := range l.conn {
					conn.WriteMessage(websocket.CloseMessage, []byte{})
					conn.Close()
				}
				return
			}
			l.list = append(l.list, lobby)
			for conn := range l.conn {
				conn.WriteJSON(lobby)
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
		conn.WriteJSON(lobby)
	}
}
