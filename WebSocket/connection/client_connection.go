package connection

import (
	"github.com/gorilla/websocket"
)

type ClientConnection struct {
	Conn   *websocket.Conn
	IP     IPType
	IsOpen bool
}
