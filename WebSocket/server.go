package main

import (
	"WebSocket/lobby"
	"encoding/json"
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
	On        struct {
		LobbyRemove chan *LobbyConnection
		LobbyUpdate chan *lobby.Info
		GameRun     chan *LobbyConnection
		GameRemove  chan *GameConnection
	}
}

func (server *Server) HandleConnection(w http.ResponseWriter, r *http.Request, clientIP string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Server HandleConnection:", err)
		return
	}

	log.Printf("Server HandleConnection: Connecting to %s....", clientIP)

	lobbyID := r.URL.Query().Get("lobby")

	lobbyConn, ok := server.Lobbies[lobbyID]
	if !ok {
		lobbyConn = newLobbyConnection(
			clientIP,
			server.On.LobbyUpdate,
			server.On.LobbyRemove,
			server.On.GameRun,
		)
		server.Lobbies[lobbyConn.id] = lobbyConn
		go lobbyConn.Init()

		server.LobbyList.new <- lobbyConn.info

		log.Printf("Server HandleConnection: LobbyInfo %s created by player (IP: %s)", lobbyConn.id, clientIP)
	}

	for player := range lobbyConn.players {
		if clientIP == player.ip {
			player.conn.Close()
			player.conn = conn
			player.send = make(chan *lobby.Info)
			player.isOpen = true

			go player.readLoop()
			go player.writeLoop()

			log.Printf("Server HandleConnection: Player %d (IP: %s) is reconnecting to the lobby %s", player.id, player.ip, lobbyConn.id)
			return
		}
	}

	log.Printf("Server HandleConnection: Player (IP: %s) is joining the lobby %s", clientIP, lobbyConn.id)

	player := &PlayerConnection{
		lobby:  lobbyConn,
		conn:   conn,
		send:   make(chan *lobby.Info),
		ip:     clientIP,
		isOpen: true,
	}
	lobbyConn.connect <- player

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

func (server *Server) HandleGameJoin(w http.ResponseWriter, r *http.Request, clientIP string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Server HandleGameJoin:", err)
		return
	}

	log.Printf("Server HandleGameJoin: Connecting to %s....", clientIP)

	lobbyID := r.URL.Query().Get("lobby")

	gameConn, ok := server.Games[lobbyID]
	if !ok {
		log.Printf("Server HandleGameJoin: Player (IP: %s) tried to join to undefined game %s", clientIP, lobbyID)
		return
	}

	for player := range gameConn.players {
		if clientIP == player.ip {
			player.conn = conn
			player.send = make(chan *GameUpdateResponse)
			player.isOpen = true
			player.gameEnd = gameConn.gameEnd

			go player.readLoop()
			go player.writeLoop()

			log.Printf("Server HandleGameJoin: Player %d (IP: %s) is connecting to the game %s", player.id, player.ip, gameConn.id)
			return
		}
	}
}

func (server *Server) GameResultsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")

	lobbyID := r.URL.Query().Get("lobby")

	gameConn, ok := server.Games[lobbyID]
	if !ok {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(gameConn.results)
	//w.WriteHeader(http.StatusOK)
}

func (server *Server) Init() {
	server.Lobbies = make(map[string]*LobbyConnection)
	server.Games = make(map[string]*GameConnection)
	server.On.LobbyRemove = make(chan *LobbyConnection)
	server.On.LobbyUpdate = make(chan *lobby.Info)
	server.On.GameRun = make(chan *LobbyConnection)
	server.On.GameRemove = make(chan *GameConnection)

	server.LobbyList.Init()
	go server.LobbyList.Listen()

	go func() {
		for {
			select {
			case lobbyConn := <-server.On.LobbyRemove:
				delete(server.Lobbies, lobbyConn.id)
				server.LobbyList.remove <- lobbyConn.info
			case lobbyInfo := <-server.On.LobbyUpdate:
				server.LobbyList.update <- lobbyInfo
			case lobbyConn := <-server.On.GameRun:
				log.Printf("Lobby %s has ran", lobbyConn.id)
				newGame := newGameConnection(lobbyConn, server.On.GameRemove)
				server.Games[newGame.id] = newGame
			case gameConn := <-server.On.GameRemove:
				delete(server.Games, gameConn.id)
			}
		}
	}()
}
