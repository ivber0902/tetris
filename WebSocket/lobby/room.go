package lobby

import (
	"WebSocket/connection"
	"github.com/google/uuid"
	"log"
)

type Room struct {
	Events *EventList
	connection.Room[Config, Config, Config]
}

type EventList struct {
	Remove chan *Room
	Update chan *Config
	Run    chan *Room
}

func New(hostIP connection.IPType, lobbyEvents *EventList) *Room {
	roomID := uuid.New().String()
	config, err := NewConfig()
	config.ID = roomID
	if err != nil {

	}
	return &Room{
		Room:   *connection.New[Config, Config, Config](connection.RoomIDType(roomID), hostIP, config),
		Events: lobbyEvents,
	}
}

func (room *Room) Init() {
	go room.Room.Init(func(*connection.Room[Config, Config, Config]) (resume bool) {
		resume = true
		select {
		case <-room.On.Next:
			room.Config.GameRun = true
			room.Events.Run <- room
			go func() {
				room.On.Update <- room.Config
			}()
		case client := <-room.Connect:
			room.Clients[client] = true
			log.Printf("Room %T %s: Player %d joined\n", client, room.HostIP, client.ID)
		case update := <-room.On.Update:
			for client := range room.Clients {
				client.Send(update)
			}
			room.Events.Update <- update
		case clientID := <-room.On.Disconnect:
			client := room.GetClientByID(clientID)
			if client == nil {
				return
			}

			if len(room.Clients) > 1 && len(room.Config.Players) > 1 {
				if newHost := room.GetClientByID(room.Config.Players[0]); client.IsHost && newHost != nil {
					room.HostIP = newHost.IP
				}
				room.Config.RemovePlayer(clientID)
				delete(room.Clients, client)
				client.Conn.Close()

				go func() {
					room.On.Update <- room.Config
				}()
			} else {
				for client = range room.Clients {
					client.Conn.Close()
				}
				room.Events.Remove <- room
			}
		}
		return
	})
}
