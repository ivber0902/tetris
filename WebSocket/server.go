package main

import (
	lobby2 "WebSocket/lobby"
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
	Games     map[string]*GameConnection
}

func (server *Server) HandleConnection(w http.ResponseWriter, r *http.Request, clientIP string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Server HandleConnection:", err)
		return
	}

	log.Printf("Server HandleConnection: Connecting to %s....", clientIP)

	lobbyID := r.URL.Query().Get("lobby")

	log.Println(clientIP, lobbyID)
	lobby, ok := server.Lobbies[lobbyID]
	log.Println(ok)
	if !ok {
		lobby = newLobbyConnection(server, clientIP)
		server.Lobbies[lobby.id] = lobby
		go lobby.Init()

		server.LobbyList.new <- lobby.info

		log.Printf("Server HandleConnection: Lobby %s created by player (IP: %s)", lobby.id, clientIP)
	}

	for player := range lobby.players {
		if clientIP == player.ip {
			player.conn.Close()
			player.conn = conn
			player.send = make(chan *lobby2.Lobby)
			player.isOpen = true

			go player.readLoop()
			go player.writeLoop()

			log.Printf("Server HandleConnection: Player %d (IP: %s) is reconnecting to the lobby %s", player.id, player.ip, lobby.id)
			return
		}
	}

	log.Printf("Server HandleConnection: Player (IP: %s) is joining the lobby %s", clientIP, lobby.id)

	player := &PlayerConnection{
		lobby:  lobby,
		conn:   conn,
		send:   make(chan *lobby2.Lobby),
		ip:     clientIP,
		isOpen: true,
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
