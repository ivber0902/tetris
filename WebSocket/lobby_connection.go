package main

import (
	"WebSocket/connection"
	"WebSocket/lobby"
	"github.com/google/uuid"
	"log"
)

// TODO вынести в отдельный модуль
// TODO удаление лобби через канал

type LobbyConnection struct {
	id         string
	info       *lobby.Config
	players    map[*PlayerConnection]bool
	connect    chan *PlayerConnection
	disconnect chan *PlayerConnection
	update     chan *lobby.Config
	hostIP     string
	remove     chan *LobbyConnection
	updates    chan *lobby.Config
	run        chan *LobbyConnection
}

func newLobbyConnection(hostIP string, updates chan *lobby.Config, remove, run chan *LobbyConnection) *LobbyConnection {
	lobbyID := uuid.New()
	var lobbyModel lobby.Config
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
		update:     make(chan *lobby.Config),
		hostIP:     hostIP,
		remove:     remove,
		updates:    updates,
		run:        run,
	}
}

func (lobby *LobbyConnection) Init() {
	for {
		go func() {
			lobby.updates <- lobby.info
		}()
		select {
		case player := <-lobby.connect:
			lobby.players[player] = true
			log.Printf("LobbyConnection: Player %d (IP: %s) connected to lobby %s Host IP: %s", player.id, player.ip, lobby.id, lobby.hostIP)

		case player := <-lobby.disconnect:
			if _, ok := lobby.players[player]; ok {
				lobby.info.RemovePlayer(connection.ClientIDType(player.id))
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
	lobby.remove <- lobby

	for player := range lobby.players {
		player.conn.Close()
	}
}

func (lobby *LobbyConnection) getPlayerByID(id int32) *PlayerConnection {
	for player := range lobby.players {
		if player.id == id {
			return player
		}
	}
	return nil
}
