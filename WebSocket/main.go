package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	//http.HandleFunc("/lobby", ConnectToLobbyHandler)
	//
	//err := http.ListenAndServe(":8080", nil)
	//if err != nil {
	//	panic(err)
	//}
	log.Println("Starting server...")
	err := ConnectToDatabase()
	log.Println("Database connected")
	if err != nil {
		panic(err)
	}
	var lobby Lobby

	err = lobby.SetDefault()
	if err != nil {
		panic(err)
	}
	err = lobby.Find(15)
	if err != nil {
		return
	}
	err = lobby.RemovePlayer(34)
	if err != nil {
		panic(err)
	}

	log.Println(lobby)

}
