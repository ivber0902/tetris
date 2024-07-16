package game

import (
	"WebSocket/connection"
	"WebSocket/queue"
	"math/rand"
	"time"
)

const ClientFigureQueueLength = 25

type State struct {
	ID              connection.ClientIDType `json:"id"`
	PlayField       [][]FigureType          `json:"play_field"`
	Figures         []FigureType            `json:"figures"`
	Buffer          FigureType              `json:"buffer"`
	FigureCount     int32                   `json:"figure_count"`
	Score           int32                   `json:"score"`
	GameOver        bool                    `json:"game_over"`
	CurrentFigure   *CurrentFigure          `json:"current_figure,omitempty"`
	figureQueue     *queue.Queue[FigureType]
	NewFigure       chan FigureType `json:"-"`
	newGlobalFigure chan FigureType
}

type CurrentFigure struct {
	Matrix   [][]int8 `json:"matrix,omitempty"`
	Position *struct {
		X int8 `json:"x"`
		Y int8 `json:"y"`
	} `json:"pos,omitempty"`
}

func (game *State) Init(PlayFieldWidth, PlayFieldHeight int8, globalFigureChan chan FigureType) {
	go game.waitNewFigures()

	game.PlayField = make([][]FigureType, PlayFieldHeight)
	for i := range game.PlayField {
		game.PlayField[i] = make([]FigureType, PlayFieldWidth)
	}

	game.figureQueue = queue.New[FigureType]()
	game.NewFigure = make(chan FigureType)
	game.newGlobalFigure = globalFigureChan
	game.Figures = make([]FigureType, ClientFigureQueueLength)

	for i := 0; i < ClientFigureQueueLength; i++ {
		game.NextFigure()
	}
	game.Buffer = game.Figures[0]
	game.NextFigure()
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

func (game *State) waitNewFigures() {
	for {
		select {
		case figure := <-game.NewFigure:
			game.figureQueue.Dispatch(figure)
		}
	}
}

func (game *State) NextFigure() {
	var nextFigure FigureType
	select {
	case nextFigure = <-game.figureQueue.Receiver():
	default:
		game.newGlobalFigure <- GetNextFigure()
		nextFigure = game.figureQueue.Receive()
	}
	game.CurrentFigure = nil
	game.FigureCount++
	game.Figures = append(game.Figures[1:], nextFigure)
}

func GetNextFigure() FigureType {
	src := rand.NewSource(time.Now().UnixNano())
	r := rand.New(src)
	return FigureType(r.Intn(7))
}
