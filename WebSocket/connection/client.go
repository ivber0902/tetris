package connection

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
)

type ClientInterface[T Object, RespType Response] interface {
	ReadLoop(func(RequestInterface) bool, func())
	WriteLoop()

	Send(RespType)
	GetID() ClientIDType
}

type Client[T Object, ConfType Object, RespType Response] struct {
	ClientConnection
	ID     ClientIDType
	Event  *ClientEvents[T, ConfType, RespType]
	send   chan *RespType
	State  *T
	Config *ConfType
	IsHost bool
}

type ClientEvents[T Object, ConfType, RespType Response] struct {
	Update     chan *RespType
	Disconnect chan ClientIDType
	Next       chan bool
}

func (c *Client[T, ConfType, RespType]) Init(conn *websocket.Conn, IP IPType) {
	c.Conn = conn
	c.send = make(chan *RespType)
	c.IsOpen = true
	c.IP = IP
}

func (c *Client[T, ConfType, RespType]) Send(update *RespType) {
	c.send <- update
}

func (c *Client[T, ConfType, RespType]) GetID() ClientIDType {
	return c.ID
}

func (c *Client[T, ConfType, RespType]) ReadLoop(callback func(*Client[T, ConfType, RespType], Request[T]) bool, lostConnCallback func(*Client[T, ConfType, RespType])) {
	defer func() {
		c.Conn.Close()
		c.IsOpen = false

		if lostConnCallback != nil {
			go lostConnCallback(c)
		}
	}()
	var request Request[T]
	for {
		err := c.Conn.ReadJSON(&request)
		if err != nil {
			switch err := err.(type) {
			case *websocket.CloseError:
				switch err.Code {
				case websocket.CloseNormalClosure,
					websocket.CloseGoingAway,
					websocket.CloseNoStatusReceived:
					log.Printf("Player (IP: %s) reading: Web socket closed by client", c.IP)
					return
				default:
					log.Printf("UNKNOWN WEBSOCKET ERROR: %v", err)
					return
				}
			case *json.SyntaxError:
				log.Printf("Player (IP: %s) reading: JSON Unmarshal error: %v", c.IP, err)
			case error:
				log.Printf("Player (IP: %s) reading: JSON reading error: %v", c.IP, err)
				return
			default:
				log.Printf("UNKNOWN ERROR: %v", err)
				return
			}
		} else {
			if !callback(c, request) {
				break
			}
		}
	}
}

func (c *Client[T, ConfType, RespType]) WriteLoop() {
	defer func() {
		c.Conn.Close()
		c.IsOpen = false
	}()

	for {
		select {
		case update, ok := <-c.send:
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			c.Conn.WriteJSON(update)
		}
	}
}
