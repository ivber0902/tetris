package main

import (
	"WebSocket/database"
	"log"
	"net/http"
)

var server Server

func main() {
	log.Println("Connecting to database...")
	loadEnv()
	err := database.Connect()
	if err != nil {
		panic(err)
	}
	log.Println("Starting server...")

	server.Init()
	http.HandleFunc("/lobby", func(w http.ResponseWriter, r *http.Request) {
		server.HandleConnection(w, r)
	})
	http.HandleFunc("/lobby/list", server.ListLobbiesHandler)
	http.HandleFunc("/game", func(w http.ResponseWriter, r *http.Request) {
		server.HandleGameJoin(w, r)
	})
	http.HandleFunc("/game/results", server.GameResultsHandler)

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
