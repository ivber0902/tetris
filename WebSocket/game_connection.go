package main

import (
	"WebSocket/game"
	"github.com/gorilla/websocket"
)

type GameConnection struct {
	id         string
	lobby      *LobbyConnection
	players    map[*PlayerGameConnection]bool
	connect    chan *PlayerGameConnection
	disconnect chan *PlayerGameConnection
	game       *game.Game
}

type PlayerGameConnection struct {
	conn   *websocket.Conn
	send   chan *game.Game
	game   *GameConnection
	ip     string
	id     int32
	isOpen bool
}
