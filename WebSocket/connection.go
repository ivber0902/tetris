package main

import (
	"WebSocket/game"
	"WebSocket/lobby"
)

type UpdateJSONRequest struct {
	Type       string                `json:"type"`
	Connection ConnectionJSONRequest `json:"connection"`
	Updates    lobby.Config          `json:"updates,omitempty"`
}

type UpdateGameJSONRequest struct {
	Type       string                `json:"type"`
	Connection ConnectionJSONRequest `json:"connection"`
	Updates    game.State            `json:"updates,omitempty"`
}

const (
	CreateRequestType     = "create"
	ConnectRequestType    = "connect"
	UpdateRequestType     = "update"
	GetRequestType        = "get"
	DisconnectRequestType = "disconnect"
	GameRunRequestType    = "run"
)

type ConnectionJSONRequest struct {
	PlayerID int32 `json:"player_id"`
}

type ConnectionJSONResponse struct {
	StatusCode int         `json:"status_code"`
	Message    string      `json:"message"`
	Body       interface{} `json:"body"`
}
