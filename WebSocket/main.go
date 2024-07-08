package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"strings"
)

var server Server

func main() {
	server.Lobbies = make(map[string]*LobbyConnection)
	go server.LobbyList.Listen()
	http.HandleFunc("/lobby", func(w http.ResponseWriter, r *http.Request) {
		PlayerIP, err := getPlayerIP(r)
		if err != nil {
			log.Println(err)
			return
		}
		server.HandleConnection(w, r, PlayerIP)
	})
	http.HandleFunc("/lobby/list", server.ListLobbiesHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}

func getPlayerIP(r *http.Request) (string, error) {
	//Get IP from the X-REAL-IP header
	ip := r.Header.Get("X-REAL-IP")
	netIP := net.ParseIP(ip)
	if netIP != nil {
		return ip, nil
	}

	//Get IP from X-FORWARDED-FOR header
	ips := r.Header.Get("X-FORWARDED-FOR")
	splitIps := strings.Split(ips, ",")
	for _, ip := range splitIps {
		netIP := net.ParseIP(ip)
		if netIP != nil {
			return ip, nil
		}
	}

	//Get IP from RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return "", err
	}
	netIP = net.ParseIP(ip)
	if netIP != nil {
		return ip, nil
	}
	return "", fmt.Errorf("no valid ip found")
}
