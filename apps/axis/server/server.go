package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/echo-webkom/axis/apps/happening"
	"github.com/echo-webkom/axis/apps/shoppinglist"
	"github.com/echo-webkom/axis/apputil"
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

	h := &apputil.Handler{DB: db}
	rf := apputil.NewRouterFactory(r, h)

	rf.Mount("/happening", happening.Router)
	rf.Mount("/shopping-list", shoppinglist.Router)

	port := ":8080"
	fmt.Println("Running on http://localhost" + port)
	http.ListenAndServe(port, r)
}
