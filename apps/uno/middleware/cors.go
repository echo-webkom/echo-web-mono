package middleware

import (
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

type Middleware func(http.Handler) http.Handler

func Cors() Middleware {
	return cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	})
}

func Logger() Middleware {
	return middleware.Logger
}
