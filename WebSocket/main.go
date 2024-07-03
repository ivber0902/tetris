package main

import (
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	loadEnv()

	http.HandleFunc("/connect", ConnectToLobbyHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}

func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}
}
