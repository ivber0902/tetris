package game

import (
	"WebSocket/queue"
	"math/rand"
	"time"
)

type Game struct {
	ID              int32         `json:"id"`
	PlayField       [][]int8      `json:"play_field"`
	Figures         []int8        `json:"figures"`
	Buffer          int8          `json:"buffer"`
	FigureCount     int32         `json:"figure_count"`
	Score           int32         `json:"score"`
	GameOver        bool          `json:"game_over"`
	CurrentFigure   CurrentFigure `json:"current_figure"`
	figureQueue     *queue.Queue[int8]
	NewFigure       chan int8 `json:"-"`
	newGlobalFigure chan int8
}

type CurrentFigure struct {
	Matrix   [][]int8 `json:"matrix,omitempty"`
	Position *struct {
		X int8 `json:"x"`
		Y int8 `json:"y"`
	} `json:"pos,omitempty"`
}

func (game *Game) Init(PlayFieldWidth, PlayFieldHeight int8, globalFigureChan chan int8) {
	go game.waitNewFigures()

	game.PlayField = make([][]int8, PlayFieldHeight)
	for i := range game.PlayField {
		game.PlayField[i] = make([]int8, PlayFieldWidth)
	}

	game.figureQueue = queue.New[int8]()
	game.NewFigure = make(chan int8)
	game.newGlobalFigure = globalFigureChan
	game.Figures = make([]int8, 5)

	for i := 0; i < 5; i++ {
		game.NextFigure()
	}
	game.Buffer = game.Figures[0]
	game.NextFigure()
	game.FigureCount = 0
	game.Score = 0
}

func (game *Game) waitNewFigures() {
	for {
		select {
		case figure := <-game.NewFigure:
			game.figureQueue.Dispatch(figure)
		}
	}
}

func (game *Game) NextFigure() {
	var nextFigure int8
	select {
	case nextFigure = <-game.figureQueue.Receiver():
	default:
		game.newGlobalFigure <- GetNextFigure()
		nextFigure = game.figureQueue.Receive()
	}
	game.CurrentFigure = CurrentFigure{}
	game.FigureCount++
	game.Figures = append(game.Figures[1:], nextFigure)
}

func GetNextFigure() int8 {
	src := rand.NewSource(time.Now().UnixNano())
	r := rand.New(src)
	return int8(r.Intn(7))
}
