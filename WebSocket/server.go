package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Server struct {
	Lobbies map[string]*LobbyConnection
}

func (server *Server) HandleConnection(w http.ResponseWriter, r *http.Request, clientIP string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	lobbyID := r.URL.Query().Get("lobby")
	lobby, ok := server.Lobbies[lobbyID]
	if !ok {
		lobby = newLobbyConnection(clientIP)
		server.Lobbies[lobby.id] = lobby
		go lobby.Init()
	}
	log.Println("Created new player")

	if func() bool {
		log.Println("Checking if lobby", lobbyID, "is ready")
		for player := range lobby.players {
			log.Println(player)
			if clientIP == player.ip {
				log.Println("Player is already connected")
				close(player.send)
				player.conn = conn
				player.send = make(chan *Lobby)
				return false
			}
		}
		return true
	}() {
		player := &PlayerConnection{
			lobby: lobby,
			conn:  conn,
			send:  make(chan *Lobby),
			ip:    clientIP,
		}
		lobby.connect <- player

		go player.readLoop()
		go player.writeLoop()
	}
}
