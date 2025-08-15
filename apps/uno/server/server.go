package server

import (
	"context"
	"log"
	"net/http"

	"github.com/echo-webkom/uno/app/happening"
	"github.com/echo-webkom/uno/config"
	"github.com/echo-webkom/uno/middleware"
	"github.com/echo-webkom/uno/repo"
	"github.com/echo-webkom/uno/routes"
	"github.com/go-chi/chi/v5"
	"github.com/jesperkha/notifier"
)

type Server struct {
	mux     *chi.Mux
	config  *config.Config
	cleanup func()
}

func New(config *config.Config) *Server {
	mux := chi.NewMux()

	mux.Use(middleware.Logger())
	mux.Use(middleware.Cors())

	mount(mux, config)

	cleanup := func() {
	}

	return &Server{
		mux,
		config,
		cleanup,
	}
}

func mount(r *chi.Mux, config *config.Config) {
	repo := repo.NewRepo(config, context.Background())

	happeningService := happening.NewHappeningService(repo)

	r.Mount("/", routes.HappeningRoutes(happeningService))
}

func (s *Server) ListenAndServe(notif *notifier.Notifier) {
	done, finish := notif.Register()

	server := &http.Server{
		Addr:    s.config.Port,
		Handler: s.mux,
	}

	go func() {
		<-done
		if err := server.Shutdown(context.Background()); err != nil {
			log.Println(err)
		}

		s.cleanup()
		finish()
	}()

	log.Println("listening on port " + s.config.Port)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Println(err)
	}
}
