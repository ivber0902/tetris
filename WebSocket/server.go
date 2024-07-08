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

	log.Println(clientIP, lobbyID)
	lobby, ok := server.Lobbies[lobbyID]
	log.Println(ok)
	if !ok {
		lobby = newLobbyConnection(clientIP)
		server.Lobbies[lobby.id] = lobby
		go lobby.Init()
	}
	log.Println("Created new player")

	for player := range lobby.players {
		if clientIP == player.ip {
			delete(lobby.players, player)
		}
	}

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
