package game

import (
	"log"
	"math/rand"
	"time"
)

type FigureArray []FigureType

func GenerateFigureArray(length int) FigureArray {
	figureArray := make(FigureArray, length)
	for i := range figureArray {
		figureArray[i] = GetRandomFigure()
	}
	log.Printf("Generated Figure Array: %v", figureArray)
	return figureArray
}

func (arr *FigureArray) AddFigure() {
	*arr = append(*arr, GetRandomFigure())
}

func (game *State) NextFigure() {
	game.FigureCount++
}

func GetRandomFigure() FigureType {
	src := rand.NewSource(time.Now().UnixNano())
	r := rand.New(src)
	return FigureType(r.Intn(7))
}
