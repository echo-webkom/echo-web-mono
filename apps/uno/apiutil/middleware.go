package apiutil

import "net/http"

func privateMiddleware(h http.Handler) http.Handler {
	return h
}

func publicMiddleware(h http.Handler) http.Handler {
	return h
}
