package main

import (
	"WebSocket/game"
	"WebSocket/lobby"
)

type GameConnection struct {
	id         string
	config     *lobby.Info
	players    map[*PlayerGameConnection]bool
	disconnect chan *PlayerGameConnection
	update     chan *GameUpdateResponse
	hostIP     string
	newFigure  chan int8
}

type GameUpdateResponse struct {
	Type   string      `json:"type"`
	Config *lobby.Info `json:"config,omitempty"`
	State  *game.Game  `json:"state,omitempty"`
}

func newGameConnection(lobby *LobbyConnection) *GameConnection {
	conn := &GameConnection{
		id:         lobby.id,
		config:     lobby.info,
		players:    make(map[*PlayerGameConnection]bool),
		disconnect: make(chan *PlayerGameConnection),
		update:     make(chan *GameUpdateResponse),
		hostIP:     lobby.hostIP,
		newFigure:  make(chan int8),
	}

	for player := range lobby.players {
		gameState := &game.Game{
			ID: player.id,
		}
		go gameState.Init(lobby.info.Settings.PlayField.Width, lobby.info.Settings.PlayField.Height, conn.newFigure)

		for i := range gameState.PlayField {
			gameState.PlayField[i] = make([]int8, lobby.info.Settings.PlayField.Width)
		}

		conn.players[&PlayerGameConnection{
			ip:     player.ip,
			id:     player.id,
			isOpen: false,
			game:   conn,
			state:  gameState,
		}] = true
	}

	go conn.Init()
	return conn
}

func (game *GameConnection) Init() {
	for {
		select {
		case updatedLobby := <-game.update:
			for player := range game.players {
				select {
				case player.send <- updatedLobby:
				}
			}
		case figure := <-game.newFigure:
			for player := range game.players {
				player.state.NewFigure <- figure
			}
		}
	}
}
