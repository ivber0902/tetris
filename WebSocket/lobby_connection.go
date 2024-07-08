package main

import "github.com/google/uuid"

type LobbyConnection struct {
	id         string
	info       *Lobby
	players    map[*PlayerConnection]bool
	connect    chan *PlayerConnection
	disconnect chan *PlayerConnection
	update     chan *Lobby
	hostIP     string
}

func newLobbyConnection(hostIP string) *LobbyConnection {
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
	}
}

func (lobby *LobbyConnection) Init() {
	for {
		select {
		case player := <-lobby.connect:
			lobby.players[player] = true
		case player := <-lobby.disconnect:
			if _, ok := lobby.players[player]; ok {
				delete(lobby.players, player)
				close(player.send)
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

func (lobby *LobbyConnection) getPlayerByID(id int32) *PlayerConnection {
	for player := range lobby.players {
		if player.id == id {
			return player
		}
	}
	return nil
}
