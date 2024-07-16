package main

import (
	"WebSocket/connection"
	"log"
	"net/http"
)

// TODO Перевости весь JSON на LowerCamelCase

var server Server

func main() {
	log.Println("Starting server...")
	server.Init()
	http.HandleFunc("/lobby", func(w http.ResponseWriter, r *http.Request) {
		PlayerIP, err := getPlayerIP(r)
		if err != nil {
			log.Println("Error during getting client IP:", err)
			return
		}
		server.HandleConnection(w, r, connection.IPType(PlayerIP))
	})
	http.HandleFunc("/lobby/list", server.ListLobbiesHandler)
	http.HandleFunc("/game", func(w http.ResponseWriter, r *http.Request) {
		PlayerIP, err := getPlayerIP(r)
		if err != nil {
			log.Println("Error during getting client IP:", err)
		}
		server.HandleGameJoin(w, r, connection.IPType(PlayerIP))
	})
	http.HandleFunc("/game/results", server.GameResultsHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
