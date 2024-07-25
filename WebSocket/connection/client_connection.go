package connection

import (
	"github.com/gorilla/websocket"
)

type ClientConnection struct {
	Conn   *websocket.Conn
	IsOpen bool
}
