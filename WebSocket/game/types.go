package game

type FigureType int8

const (
	StartRequestType    = "start"
	ConfigRequestType   = "config"
	AllRequestType      = "all"
	UpdateRequestType   = "update"
	SetRequestType      = "set"
	GameOverRequestType = "game_over"
	RowRequestType      = "clear_rows"
)
