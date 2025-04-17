package server

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/echo-webkom/axis/apputil"
	"github.com/echo-webkom/axis/config"
	"github.com/echo-webkom/axis/storage/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func Run(config *config.Config) {
	r := chi.NewRouter()

	r.Use(adminKeyMiddleware(config.AdminKey))
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "https://echo.uib.no"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	ctx := context.Background()
	pool, err := database.Connect(ctx, config.DBConnStr)
	if err != nil {
		log.Fatalln(err)
	}
	defer pool.Close()

	h := &apputil.Handler{Pool: pool}
	rf := apputil.NewRouterFactory(r, h)
	mount(rf)

	port := toGoPort(config.Port)
	fmt.Println("Running on http://localhost" + port)
	http.ListenAndServe(port, r)
}
