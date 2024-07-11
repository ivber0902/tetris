package connection

import "github.com/gorilla/websocket"

type Player[T InfoObject] struct {
	Conn   *websocket.Conn
	Send   chan *T
	Parent *Room[T]
	IP     string
	ID     int32
	IsOpen bool
}
