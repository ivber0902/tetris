package game

import (
	"WebSocket/connection"
	"WebSocket/lobby"
	"log"
	"time"
)

type Room struct {
	Events    *EventList
	NewFigure chan FigureType
	GameEnd   chan *State
	Results   *Results

	connection.Room[State, lobby.Config, Response]
}

type EventList struct {
	Remove chan *Room
	Update chan *Response
}

func New(lobbyRoom *lobby.Room, lobbyEvents *EventList) *Room {
	room := &Room{
		Room:      *connection.New[State, lobby.Config, Response](lobbyRoom.ID, lobbyRoom.HostIP, lobbyRoom.Config),
		Events:    lobbyEvents,
		NewFigure: make(chan FigureType),
	}

	for player := range lobbyRoom.Clients {
		gameState := &State{
			ID: player.ID,
		}
		go gameState.Init(lobbyRoom.Config.Settings.PlayField.Width, lobbyRoom.Config.Settings.PlayField.Height, room.NewFigure)

		for i := range gameState.PlayField {
			gameState.PlayField[i] = make([]FigureType, lobbyRoom.Config.Settings.PlayField.Width)
		}

		room.Clients[&connection.Client[State, lobby.Config, Response]{
			ClientConnection: player.ClientConnection,
			ID:               player.ID,
			State:            gameState,
			Config:           lobbyRoom.Config,
			Event:            room.On,
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
		case figure := <-room.NewFigure:
			for player := range room.Clients {
				player.State.NewFigure <- figure
			}
		case player := <-room.GameEnd:
			room.Results.Add(player)

			if func() bool {
				for player := range room.Clients {
					if !player.State.GameOver {
						return false
					}
				}
				return true
			}() {
				for player := range room.Clients {
					player.Send(&Response{
						Type: "game_over",
					})
				}
				room.ShowResultsTimeout()
				return false
			}

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
