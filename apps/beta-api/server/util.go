package server

import (
	"log"
	"net/http"
)

func toGoPort(port string) string {
	if port == "" {
		log.Fatal("port not set")
	}
	if port[0] != ':' {
		return ":" + port
	}
	return port
}

func adminKeyMiddleware(adminKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Header.Get("Authorization") != "Bearer "+adminKey {
				http.Error(w, "Forbidden", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
