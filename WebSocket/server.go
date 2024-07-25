package main

import (
	"WebSocket/connection"
	"WebSocket/game"
	"WebSocket/lobby"
	"encoding/json"
	"fmt"
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
	Lobbies   map[connection.RoomIDType]*lobby.Room
	LobbyList LobbyList
	Games     map[connection.RoomIDType]*game.Room
	On        struct {
		Lobby *lobby.EventList
		Game  *game.EventList
	}
}

func (server *Server) Init() {
	server.Lobbies = make(map[connection.RoomIDType]*lobby.Room)
	server.Games = make(map[connection.RoomIDType]*game.Room)
	server.On.Lobby = &lobby.EventList{
		Remove: make(chan *lobby.Room),
		Update: make(chan *lobby.Config),
		Run:    make(chan *lobby.Room),
	}
	server.On.Game = &game.EventList{
		Remove: make(chan *game.Room),
		Update: make(chan *game.Response),
	}

	server.LobbyList.Init()
	go server.LobbyList.Listen()

	go func() {
		for {
			select {
			case lobbyConn := <-server.On.Lobby.Remove:
				server.LobbyList.remove <- lobbyConn.Config
				delete(server.Lobbies, lobbyConn.ID)
			case lobbyInfo := <-server.On.Lobby.Update:
				if !lobbyInfo.GameRun {
					server.LobbyList.update <- lobbyInfo
				}
			case lobbyConn := <-server.On.Lobby.Run:
				log.Printf("Lobby %s has ran", lobbyConn.ID)
				newGame := game.New(lobbyConn, server.On.Game)
				newGame.Init()
				server.Games[newGame.ID] = newGame
				server.LobbyList.remove <- lobbyConn.Config
			case gameConn := <-server.On.Game.Remove:
				delete(server.Games, gameConn.ID)
			}
		}
	}()
}

func (server *Server) HandleConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Server HandleConnection:", err)
		return
	}

	lobbyID := connection.RoomIDType(r.URL.Query().Get("lobby"))
	log.Printf("Server HandleConnection: Connecting to %s....", lobbyID)

	playerID := connection.ClientIDType(r.URL.Query().Get("player"))

	if len(playerID) == 0 {
		log.Println("Server HandleConnection: Invalid player ID")
		conn.Close()
		return
	}

	lobbyConn, existsLobby := server.Lobbies[lobbyID]
	if !existsLobby {
		lobbyConn = lobby.New(playerID, server.On.Lobby)
		server.Lobbies[lobbyConn.ID] = lobbyConn
		go lobbyConn.Init()

		server.LobbyList.new <- lobbyConn.Config

		log.Printf("Server HandleConnection: LobbyInfo %s created by player (ID: %s)", lobbyConn.ID, playerID)
	}

	if lobbyConn.Config.GameRun {
		conn.Close()
		return
	}

	for player := range lobbyConn.Clients {
		if playerID == player.ID {
			fmt.Println("State", player.State)
			player.Conn.Close()
			player.Init(conn)

			go player.ReadLoop(lobby.HandleRequest, lobby.WaitConnection)
			go player.WriteLoop()

			log.Printf("Server HandleConnection: Player (ID: %s) is reconnecting to the lobby %s", player.ID, lobbyConn.ID)
			return
		}
	}

	log.Printf("Server HandleConnection: Player (IP: %s) is joining the lobby %s", playerID, lobbyConn.ID)

	player := lobbyConn.ConnectClient(conn, playerID)
	if !existsLobby {
		player.IsHost = true
	}
	lobbyConn.Connect <- player

	go player.ReadLoop(lobby.HandleRequest, lobby.WaitConnection)
	go player.WriteLoop()
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

func (server *Server) HandleGameJoin(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Server HandleGameJoin:", err)
		return
	}

	lobbyID := connection.RoomIDType(r.URL.Query().Get("lobby"))
	log.Printf("Server HandleGameJoin: Connecting to %s....", lobbyID)

	playerID := connection.ClientIDType(r.URL.Query().Get("player"))

	if len(playerID) == 0 {
		log.Println("Server HandleConnection: Invalid player ID")
		conn.Close()
		return
	}

	gameConn, ok := server.Games[lobbyID]
	if !ok {
		log.Printf("Server HandleGameJoin: Player (ID: %s) tried to join to undefined game %s", playerID, lobbyID)
		return
	}

	for player := range gameConn.Clients {
		if playerID == player.ID {
			player.Conn = conn
			player.Init(conn)

			go player.ReadLoop(func(c *connection.Client[game.State, lobby.Config, game.Response], r connection.Request[game.State]) bool {
				return game.HandleRequest(gameConn, player, r)
			}, game.WaitConnection)
			go player.WriteLoop()

			log.Printf("Server HandleGameJoin: Player (ID: %s) is connecting to the game %s", player.ID, gameConn.ID)
			return
		}
	}
}

func (server *Server) GameResultsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")

	lobbyID := connection.RoomIDType(r.URL.Query().Get("lobby"))

	gameConn, ok := server.Games[lobbyID]
	if !ok {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	type Results struct {
		PlayerID connection.ClientIDType `json:"player_id"`
		Score    int                     `json:"score"`
	}
	var res = make([]Results, 0)

	for _, player := range gameConn.Results.Players {
		res = append(res, Results{PlayerID: player.ID, Score: player.Score})
	}

	json.NewEncoder(w).Encode(res)
	//w.WriteHeader(http.StatusOK)
}
