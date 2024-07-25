package game

import (
	"WebSocket/connection"
	"WebSocket/lobby"
)

type Room struct {
	Events  *EventList
	GameEnd chan *State
	Results *Results
	Figures *FigureArray

	connection.Room[State, lobby.Config, Response]
}

type EventList struct {
	Remove chan *Room
	Update chan *Response
}

func New(lobbyRoom *lobby.Room, lobbyEvents *EventList) *Room {
	figures := GenerateFigureArray(ClientFigureQueueLength)
	room := &Room{
		Room:    *connection.New[State, lobby.Config, Response](lobbyRoom.ID, lobbyRoom.HostID, lobbyRoom.Config),
		Events:  lobbyEvents,
		Figures: &figures,
		Results: &Results{},
		GameEnd: make(chan *State),
	}

	for player := range lobbyRoom.Clients {
		gameState := &State{
			ID: player.ID,
		}
		go gameState.Init(lobbyRoom.Config.Settings.PlayField.Width, lobbyRoom.Config.Settings.PlayField.Height, room.Figures)

		for i := range gameState.PlayField {
			gameState.PlayField[i] = make([]FigureType, lobbyRoom.Config.Settings.PlayField.Width)
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
		case player := <-room.GameEnd:
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
				room.Config.GameRun = false
				room.Results.AddPlayer(player, true)
				room.Results.Set(room.Config.Settings.Difficulty, 0)
				room.SaveResults(room.Results)
				return false
			}
			room.Results.AddPlayer(player, false)

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
