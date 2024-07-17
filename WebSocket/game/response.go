package game

import "WebSocket/lobby"

type Response struct {
	Type    string        `json:"type"`
	Config  *lobby.Config `json:"config,omitempty"`
	State   *State        `json:"state,omitempty"`
	Figures []FigureType  `json:"figures,omitempty"`
	Info    interface{}   `json:"info,omitempty"`
}

type AddRowInfo struct {
	Count         int `json:"count"`
	ClearedColumn int `json:"empty_column"`
}
