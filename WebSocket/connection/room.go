package connection

import (
	"github.com/gorilla/websocket"
	"log"
)

type Room[T Object, ConfType Object, RespType Response] struct {
	ID      RoomIDType
	Clients map[*Client[T, ConfType, RespType]]bool
	Connect chan *Client[T, ConfType, RespType]
	Config  *ConfType

	HostID ClientIDType

	On *ClientEvents[T, ConfType, RespType]
}

func New[T Object, ConfType Object, RespType Response](id RoomIDType, hostID ClientIDType, conf *ConfType) *Room[T, ConfType, RespType] {
	return &Room[T, ConfType, RespType]{
		ID:      id,
		Clients: make(map[*Client[T, ConfType, RespType]]bool),
		Connect: make(chan *Client[T, ConfType, RespType]),
		Config:  conf,

		HostID: hostID,
		On: &ClientEvents[T, ConfType, RespType]{
			Update:     make(chan *RespType),
			Disconnect: make(chan ClientIDType),
			Next:       make(chan bool),
		},
	}
}

func (r *Room[T, ConfType, RespType]) Init(loop func(room *Room[T, ConfType, RespType]) bool) {
	for loop(r) {
	}
}

func (r *Room[T, ConfType, RespType]) DefaultUpdate() {
	select {
	case client := <-r.Connect:
		r.Clients[client] = true
		log.Printf("Room %T %s: Player %v joined\n", client, r.HostID, client.ID)
	case update := <-r.On.Update:
		for client := range r.Clients {
			client.Send(update)
		}
	default:
	}
}

func (r *Room[T, ConfType, RespType]) ConnectClient(conn *websocket.Conn, ID ClientIDType) *Client[T, ConfType, RespType] {
	client := &Client[T, ConfType, RespType]{
		Event:  r.On,
		Config: r.Config,
		ID:     ID,
	}
	client.Init(conn)
	return client
}

func (r *Room[T, ConfType, RespType]) GetClientByID(id ClientIDType) *Client[T, ConfType, RespType] {
	for client := range r.Clients {
		if client.ID == id {
			return client
		}
	}
	return nil
}
