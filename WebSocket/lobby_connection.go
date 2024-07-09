package main

import (
	"github.com/google/uuid"
	"log"
)

type LobbyConnection struct {
	id         string
	info       *Lobby
	players    map[*PlayerConnection]bool
	connect    chan *PlayerConnection
	disconnect chan *PlayerConnection
	update     chan *Lobby
	hostIP     string
	server     *Server
}

func newLobbyConnection(server *Server, hostIP string) *LobbyConnection {
	lobbyID := uuid.New()
	var lobbyModel Lobby
	err := lobbyModel.SetDefault()
	if err != nil {
		return nil
	}
	lobbyModel.Init(lobbyID.String())
	return &LobbyConnection{
		id:         lobbyID.String(),
		info:       &lobbyModel,
		players:    map[*PlayerConnection]bool{},
		connect:    make(chan *PlayerConnection),
		disconnect: make(chan *PlayerConnection),
		update:     make(chan *Lobby),
		hostIP:     hostIP,
		server:     server,
	}
}

func (lobby *LobbyConnection) Init() {
	for {
		go func() {
			lobby.server.LobbyList.update <- lobby.info
		}()
		select {
		case player := <-lobby.connect:
			lobby.players[player] = true
			log.Printf("LobbyConnection: Player %d (IP: %s) connected to lobby %s Host IP: %s", player.id, player.ip, lobby.id, lobby.hostIP)

		case player := <-lobby.disconnect:
			if _, ok := lobby.players[player]; ok {
				lobby.info.RemovePlayer(player.id)
				delete(lobby.players, player)
				close(player.send)
				player.conn.Close()
				if player.ip == lobby.hostIP {
					log.Printf("LobbyConnection: Lobby %s removed", lobby.id)
					lobby.Remove()
					return
				}

				go func() {
					lobby.update <- lobby.info
				}()
				log.Printf("LobbyConnection: Player %d (IP: %s) disconnected from lobby %s Host IP: %s", player.id, player.ip, lobby.id, lobby.hostIP)
			}

		case updatedLobby := <-lobby.update:
			for player := range lobby.players {
				select {
				case player.send <- updatedLobby:
				}
			}

		}

	}
}

func (lobby *LobbyConnection) Remove() {
	lobby.server.LobbyList.remove <- lobby.info

	for player := range lobby.players {
		player.conn.Close()
	}
	delete(lobby.server.Lobbies, lobby.id)
}

func (lobby *LobbyConnection) getPlayerByID(id int32) *PlayerConnection {
	for player := range lobby.players {
		if player.id == id {
			return player
		}
	}
	return nil
}
