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

	HostIP IPType

	On *ClientEvents[T, ConfType, RespType]
}

func New[T Object, ConfType Object, RespType Response](id RoomIDType, hostIP IPType, conf *ConfType) *Room[T, ConfType, RespType] {
	return &Room[T, ConfType, RespType]{
		ID:      id,
		Clients: make(map[*Client[T, ConfType, RespType]]bool),
		Connect: make(chan *Client[T, ConfType, RespType]),
		Config:  conf,

		HostIP: hostIP,
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
		log.Printf("Room %T %s: Player %d joined\n", client, r.HostIP, client.ID)
	case update := <-r.On.Update:
		for client := range r.Clients {
			client.Send(update)
		}
	default:
	}
}

func (r *Room[T, ConfType, RespType]) ConnectClient(conn *websocket.Conn, IP IPType) *Client[T, ConfType, RespType] {
	client := &Client[T, ConfType, RespType]{
		Event:  r.On,
		Config: r.Config,
	}
	client.Init(conn, IP)
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
