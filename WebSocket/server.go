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
	Lobbies   map[string]*LobbyConnection
	LobbyList LobbyList
}

func (server *Server) HandleConnection(w http.ResponseWriter, r *http.Request, clientIP string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	log.Println("Connect", clientIP)

	lobbyID := r.URL.Query().Get("lobby")

	log.Println(clientIP, lobbyID)
	lobby, ok := server.Lobbies[lobbyID]
	log.Println(ok)
	if !ok {
		lobby = newLobbyConnection(server, clientIP)
		server.Lobbies[lobby.id] = lobby
		go lobby.Init()

		server.LobbyList.new <- lobby.info
	}
	log.Println("Created new player")

	// for player := range lobby.players {
	// 	if clientIP == player.ip {
	// 		delete(lobby.players, player)
	// 	}
	// }

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

func (server *Server) ListLobbiesHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	server.LobbyList.AddConnection(conn)

	go server.LobbyList.ListenConnection(conn)
}
