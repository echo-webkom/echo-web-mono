package server

import (
	"context"
	"log"
	"net/http"

	"github.com/echo-webkom/uno/config"
	"github.com/echo-webkom/uno/pkg/middleware"
	"github.com/echo-webkom/uno/server/routes"
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

	r := routes.NewRouter(config)
	mux.Mount("/", r.Handler())

	cleanup := func() {
	}

	return &Server{
		mux,
		config,
		cleanup,
	}
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

	log.Println("🔃 Uno running on http://localhost" + s.config.Port)
	log.Println("📚 See Swagger documentation on http://localhost" + s.config.Port + "/swagger")
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Println(err)
	}
}
