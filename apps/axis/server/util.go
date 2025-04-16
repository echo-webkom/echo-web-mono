package server

import "log"

func toGoPort(port string) string {
	if port == "" {
		log.Fatal("port not set")
	}
	if port[0] != ':' {
		return ":" + port
	}
	return port
}
