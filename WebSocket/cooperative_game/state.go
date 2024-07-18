package game

import (
	"WebSocket/connection"
	"WebSocket/game"
	"WebSocket/queue"
)

const ClientFigureQueueLength = 666

type State struct {
	ID             connection.ClientIDType `json:"id"`
	PlayField      [][]game.FigureType     `json:"play_field"`
	Figures        *game.FigureArray       `json:"-"`
	Buffer         game.FigureType         `json:"buffer"`
	FigureCount    int                     `json:"figure_count"`
	Score          int                     `json:"score"`
	GameOver       bool                    `json:"game_over"`
	CurrentFigures []*CurrentFigure        `json:"current_figure,omitempty"`
	Started        bool                    `json:"started"`
	figureQueue    *queue.Queue[game.FigureType]
}

type CurrentFigure struct {
	Matrix   [][]int8 `json:"matrix,omitempty"`
	Position *struct {
		X int8 `json:"x"`
		Y int8 `json:"y"`
	} `json:"pos,omitempty"`
}

func (state *State) Init(playFieldWidth, playFieldHeight int8, figures *game.FigureArray) {
	state.PlayField = make([][]game.FigureType, playFieldHeight)
	for i := range state.PlayField {
		state.PlayField[i] = make([]game.FigureType, playFieldWidth)
	}

	state.figureQueue = queue.New[game.FigureType]()
	state.Figures = figures
	state.Buffer = (*figures)[1]
	state.FigureCount = 0
	state.Score = 0
}

func (state *State) Update(newGame *State) {
	if newGame != nil {
		state.PlayField = newGame.PlayField
		state.Buffer = newGame.Buffer
		state.Score = newGame.Score
		state.GameOver = newGame.GameOver
		state.CurrentFigures = newGame.CurrentFigures
	}
}

func (state *State) NextFigure() {
	state.FigureCount++
}
