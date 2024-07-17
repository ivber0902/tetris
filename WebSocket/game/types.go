package game

type FigureType int8

const (
	ConfigRequestType   = "config"
	AllRequestType      = "all"
	UpdateRequestType   = "update"
	SetRequestType      = "set"
	GameOverRequestType = "game_over"
	RowRequestType      = "send_row"
)
