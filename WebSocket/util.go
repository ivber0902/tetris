package main

import (
	"encoding/json"
	"github.com/joho/godotenv"
	"os"
)

func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}
}

func loadDefaultLobby() (Lobby, error) {
	file, err := os.Open("default-lobby.json")
	if err != nil {
		return Lobby{}, err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	decoder := json.NewDecoder(file)
	var lobby Lobby

	err = decoder.Decode(&lobby)
	if err != nil {
		return Lobby{}, err
	}

	return lobby, nil
}
