package routes

import (
	"context"
	"net/http"

	"github.com/echo-webkom/uno/config"
	"github.com/echo-webkom/uno/repo"
	"github.com/echo-webkom/uno/service"
	"github.com/echo-webkom/uno/storage"
	"github.com/go-chi/chi/v5"
)

type Router struct {
	mux    *chi.Mux
	config *config.Config

	// Services
	hs *service.HappeningService
	cs *service.CommentService
}

func NewRouter(config *config.Config) *Router {
	// Create storage adapters
	postgres := storage.NewPostgres(config, context.Background())

	// Create repos
	hr := repo.NewHappeningRepo(postgres)
	cr := repo.NewCommentRepo(postgres)

	// Create services
	hs := service.NewHappeningService(hr)
	cs := service.NewCommentService(cr)

	r := &Router{
		mux:    chi.NewMux(),
		config: config,

		hs: hs,
		cs: cs,
	}

	r.mount()
	return r
}

func (r *Router) mount() {
	r.mux.Mount("/happenings", r.HappeningRoutes())
	r.mux.Mount("/swagger", r.SwaggerRoutes())
}

func (r *Router) Handler() http.Handler {
	return r.mux
}
