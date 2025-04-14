package main

import (
	"net/http"

	"github.com/echo-webkom/axis/services/happening"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/happening", happening.Controlller())

	http.ListenAndServe(":8080", r)
}
