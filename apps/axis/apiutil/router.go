package apiutil

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

// Router wraps chi.Mux and serves as a ready-to-use router apps can create.
// Mounted handlers are private by default.
type Router struct {
	r *chi.Mux
}

type Flag int

const (
	Private Flag = iota
	Public
)

func NewRouter() *Router {
	return &Router{
		r: chi.NewRouter(),
	}
}

func addMiddleware(h http.Handler, flags ...Flag) http.HandlerFunc {
	// Private by default
	if len(flags) == 0 {
		h = privateMiddleware(h)
	}

	for _, flag := range flags {
		switch flag {
		case Private:
			h = privateMiddleware(h)
		case Public:
			h = publicMiddleware(h)
		}
	}

	return func(w http.ResponseWriter, r *http.Request) {
		h.ServeHTTP(w, r)
	}
}

func (r *Router) Get(path string, h http.HandlerFunc, flags ...Flag) {
	h = addMiddleware(h, flags...)
	r.r.Get(path, h)
}

func (r *Router) Post(path string, h http.HandlerFunc, flags ...Flag) {
	h = addMiddleware(h, flags...)
	r.r.Post(path, h)
}

func (router Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	router.r.ServeHTTP(w, r)
}
