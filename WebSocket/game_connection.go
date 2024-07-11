package main

import (
	"WebSocket/game"
	"WebSocket/lobby"
	"log"
	"time"
)

type GameConnection struct {
	id         string
	config     *lobby.Info
	players    map[*PlayerGameConnection]bool
	disconnect chan *PlayerGameConnection
	remove     chan *GameConnection
	update     chan *GameUpdateResponse
	hostIP     string
	newFigure  chan int8
	results    *GameResults
	gameEnd    chan *game.Game
}

type GameUpdateResponse struct {
	Type   string      `json:"type"`
	Config *lobby.Info `json:"config,omitempty"`
	State  *game.Game  `json:"state,omitempty"`
}

func newGameConnection(lobby *LobbyConnection, remove chan *GameConnection) *GameConnection {
	conn := &GameConnection{
		id:         lobby.id,
		config:     lobby.info,
		players:    make(map[*PlayerGameConnection]bool),
		disconnect: make(chan *PlayerGameConnection),
		update:     make(chan *GameUpdateResponse),
		hostIP:     lobby.hostIP,
		newFigure:  make(chan int8),
		results:    &GameResults{},
		gameEnd:    make(chan *game.Game),
		remove:     remove,
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
				if player.isOpen {
					select {
					case player.send <- updatedLobby:
					}
				}
			}
		case figure := <-game.newFigure:
			for player := range game.players {
				player.state.NewFigure <- figure
			}
		case player := <-game.gameEnd:
			game.results.Add(player)

			if func() bool {
				for player := range game.players {
					if !player.state.GameOver {
						return false
					}
				}
				return true
			}() {
				for player := range game.players {
					player.send <- &GameUpdateResponse{
						Type: "game_over",
					}
				}
				game.ShowResultsTimeout()
				return
			}

		case player := <-game.disconnect:
			close(player.send)
			player.state.GameOver = true
			go func() {
				game.update <- &GameUpdateResponse{
					Type:  "update",
					State: player.state,
				}
			}()
		}
	}
}

func (game *GameConnection) ShowResultsTimeout() {
	go func() {
		log.Printf("Show Results for game %s", game.id)
		time.Sleep(time.Hour)
		game.remove <- game
	}()
}
