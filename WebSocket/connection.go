package main

type UpdateJSONRequest struct {
	Type       string                `json:"type"`
	Connection ConnectionJSONRequest `json:"connection"`
	Updates    Lobby                 `json:"updates,omitempty"`
}

const (
	ConnectRequestType = "connect"
	UpdateRequestType  = "update"
)

type ConnectionJSONRequest struct {
	LobbyID  int32 `json:"lobby_id"`
	PlayerID int32 `json:"player_id"`
}

type ConnectionJSONResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}
