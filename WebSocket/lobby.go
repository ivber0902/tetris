package main

type Lobby struct {
	ID       int32   `bson:"_id"`
	Players  []int32 `bson:"players" json:"players,omitempty"`
	Settings struct {
		Music      string `bson:"music" json:"music,omitempty"`
		Background string `bson:"background" json:"background,omitempty"`
		Difficulty int8   `bson:"difficulty" json:"difficulty,omitempty"`

		PlayField struct {
			Width  int8 `bson:"width" json:"width,omitempty"`
			Height int8 `bson:"height" json:"height,omitempty"`
		} `bson:"play_field" json:"play_field,omitempty"`
	} `bson:"settings,omitempty"`
}
