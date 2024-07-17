package game

import (
	"WebSocket/connection"
	"WebSocket/queue"
)

const ClientFigureQueueLength = 666

type State struct {
	ID            connection.ClientIDType `json:"id"`
	PlayField     [][]FigureType          `json:"play_field"`
	Figures       *FigureArray            `json:"-"`
	Buffer        FigureType              `json:"buffer"`
	FigureCount   int                     `json:"figure_count"`
	Score         int                     `json:"score"`
	GameOver      bool                    `json:"game_over"`
	CurrentFigure *CurrentFigure          `json:"current_figure,omitempty"`
	figureQueue   *queue.Queue[FigureType]
}

type CurrentFigure struct {
	Matrix   [][]int8 `json:"matrix,omitempty"`
	Position *struct {
		X int8 `json:"x"`
		Y int8 `json:"y"`
	} `json:"pos,omitempty"`
}

func (game *State) Init(playFieldWidth, playFieldHeight int8, figures *FigureArray) {
	game.PlayField = make([][]FigureType, playFieldHeight)
	for i := range game.PlayField {
		game.PlayField[i] = make([]FigureType, playFieldWidth)
	}

	game.figureQueue = queue.New[FigureType]()
	game.Figures = figures
	game.Buffer = (*figures)[1]
	game.FigureCount = 0
	game.Score = 0
}

func (game *State) Update(newGame *State) {
	if newGame != nil {
		game.PlayField = newGame.PlayField
		game.Figures = newGame.Figures
		game.Buffer = newGame.Buffer
		game.Score = newGame.Score
		game.GameOver = newGame.GameOver
		game.CurrentFigure = newGame.CurrentFigure
	}
}
