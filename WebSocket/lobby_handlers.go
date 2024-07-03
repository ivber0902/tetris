package main

import (
	"log"
	"net/http"
)

func ConnectToLobbyHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := conn.Close(); err != nil {
			panic(err)
		}
	}()

	var request UpdateJSONRequest

	for {
		err = conn.ReadJSON(&request)
		if err != nil {
			log.Println("JSON reading error during connection:", err)
		} else if request.Type == ConnectRequestType {
			err = ConnectToLobby(request.Connection)
			if err != nil {
				log.Println("Connect to lobby error:", err)
			} else {
				break
			}
		}
		err := conn.WriteJSON(
			ConnectionJSONResponse{
				StatusCode: 400,
				Message:    "Wrong JSON format",
			},
		)
		if err != nil {
			log.Println("JSON writing error during connection:", err)
			return
		}
	}

	for {
		err = conn.ReadJSON(&request)
		if err != nil {
			log.Println("JSON reading error:", err)
			err := conn.WriteJSON(
				ConnectionJSONResponse{
					StatusCode: 400,
					Message:    "Wrong JSON format",
				},
			)
			if err != nil {
				log.Println("JSON writing error during connection:", err)
				return
			}
		} else if request.Type == UpdateRequestType {
			err := UpdateLobby(request)
			if err != nil {
				log.Println("Update lobby error:", err)
			}
		}
	}
}
