package game

import "WebSocket/lobby"

type Response struct {
	Type   string        `json:"type"`
	Config *lobby.Config `json:"config,omitempty"`
	State  *State        `json:"state,omitempty"`
}
