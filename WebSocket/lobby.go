package main

type Lobby struct {
	ID       int32         `bson:"_id"`
	Players  []int32       `bson:"players"`
	Settings LobbySettings `bson:"settings"`
}

type LobbySettings struct {
	PlayField  PlayField `bson:"play_field"`
	Music      string    `bson:"music"`
	Background string    `bson:"background"`
	Difficulty int8      `bson:"difficulty"`
}

type PlayField struct {
	Width  int `bson:"width"`
	Height int `bson:"height"`
}
