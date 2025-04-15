package server

import (
	"log"
	"net/http"

	"github.com/echo-webkom/axis/apps/happening"
	"github.com/echo-webkom/axis/server/handler"
	"github.com/echo-webkom/axis/storage/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func Run() {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "https://echo.uib.no"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	db, err := database.Connect()
	if err != nil {
		log.Fatalln(err)
	}
	defer db.Close()

	h := &handler.Handler{DB: db}
	rf := handler.NewRouterFactory(r, h)

	rf.Mount("/", happening.Router)

	http.ListenAndServe(":8080", r)
}
