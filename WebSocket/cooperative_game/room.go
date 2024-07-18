package game

import (
	"WebSocket/connection"
	"WebSocket/game"
	"WebSocket/lobby"
	"log"
	"time"
)

type Room struct {
	Events  *EventList
	GameEnd chan *State
	Figures *game.FigureArray

	connection.Room[State, lobby.Config, Response]
}

type EventList struct {
	Remove chan *Room
	Update chan *Response
}

func New(lobbyRoom *lobby.Room, lobbyEvents *EventList) *Room {
	figures := game.GenerateFigureArray(ClientFigureQueueLength)
	room := &Room{
		Room:    *connection.New[State, lobby.Config, Response](lobbyRoom.ID, lobbyRoom.HostIP, lobbyRoom.Config),
		Events:  lobbyEvents,
		Figures: &figures,
		GameEnd: make(chan *State),
	}

	for player := range lobbyRoom.Clients {
		gameState := &State{
			ID: player.ID,
		}
		go gameState.Init(lobbyRoom.Config.Settings.PlayField.Width, lobbyRoom.Config.Settings.PlayField.Height, room.Figures)

		for i := range gameState.PlayField {
			gameState.PlayField[i] = make([]game.FigureType, lobbyRoom.Config.Settings.PlayField.Width)
		}

		room.Clients[&connection.Client[State, lobby.Config, Response]{
			ClientConnection: player.ClientConnection,
			ID:               player.ID,
			State:            gameState,
			Config:           lobbyRoom.Config,
			Event:            room.On,
			IsHost:           player.IsHost,
		}] = true
	}
	return room
}

func (room *Room) Init() {
	go room.Room.Init(func(*connection.Room[State, lobby.Config, Response]) bool {
		select {
		case updatedLobby := <-room.On.Update:
			for player := range room.Clients {
				if player.IsOpen {
					player.Send(updatedLobby)
				}
			}
		case <-room.GameEnd:
			go func() {
				room.On.Update <- &Response{
					Type: "game_over",
				}
			}()
			room.ShowResultsTimeout()
			return false

		case playerID := <-room.On.Disconnect:
			if player := room.GetClientByID(playerID); player != nil {
				player.State.GameOver = true
				go func() {
					room.On.Update <- &Response{
						Type:  "update",
						State: player.State,
					}
				}()
			}
		}
		return true
	})
}

func (room *Room) ShowResultsTimeout() {
	go func() {
		log.Printf("Show Results for game %s", room.ID)
		time.Sleep(time.Hour)
		room.Events.Remove <- room
	}()
}
