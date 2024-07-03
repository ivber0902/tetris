package main

type Lobby struct {
	ID       int32   `bson:"_id"`
	Players  []int32 `bson:"players" json:"players"`
	Settings struct {
		Music      string `bson:"music" json:"music"`
		Background string `bson:"background" json:"background"`
		Difficulty int8   `bson:"difficulty" json:"difficulty"`

		PlayField struct {
			Width  int8 `bson:"width" json:"width"`
			Height int8 `bson:"height" json:"height"`
		} `bson:"play_field" json:"play_field"`
	} `bson:"settings"`
}
