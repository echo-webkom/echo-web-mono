package routes

import (
	"context"
	"net/http"

	"github.com/echo-webkom/uno/app/happening"
	"github.com/echo-webkom/uno/config"
	"github.com/echo-webkom/uno/repo"
	"github.com/go-chi/chi/v5"
)

type Router struct {
	mux *chi.Mux
	hap *happening.HappeningService
}

func NewRouter(config *config.Config) *Router {
	repo := repo.NewRepo(config, context.Background())

	r := &Router{
		mux: chi.NewMux(),
		hap: happening.NewHappeningService(repo),
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
