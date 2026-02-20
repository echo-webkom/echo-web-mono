package uno

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Mux struct {
	mux         *chi.Mux
	middlewares []func(http.Handler) http.Handler
}

func NewMux(middlewares ...func(http.Handler) http.Handler) *Mux {
	mux := chi.NewMux()

	mux.Use(chiMiddleware.StripSlashes)
	mux.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Admin-Key"},
		ExposedHeaders:   []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	return &Mux{
		mux:         mux,
		middlewares: middlewares,
	}
}

func (m *Mux) applyMiddlewares(h http.Handler, middlewares ...Middleware) http.Handler {
	for _, m := range middlewares {
		h = m(h)
	}
	for _, m := range m.middlewares {
		h = m(h)
	}
	return h
}

func (m *Mux) Handle(method string, pattern string, h Handler, middlewares ...Middleware) {
	m.mux.MethodFunc(method, pattern, func(w http.ResponseWriter, r *http.Request) {
		httpH := m.applyMiddlewares(h, middlewares...)
		httpH.ServeHTTP(w, r)
	})
}

// Mount allows mounting a standard http.Handler (useful for swagger, pprof, etc.)
func (m *Mux) Mount(pattern string, h http.Handler, middleware ...Middleware) {
	h = m.applyMiddlewares(h, middleware...)
	m.mux.Mount(pattern, h)
}

func (m Mux) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	m.mux.ServeHTTP(ReuseOrNewContext(w, r), r)
}
