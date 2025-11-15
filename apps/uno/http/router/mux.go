package router

import (
	"log"
	"net/http"
	"uno/http/handler"

	"github.com/go-chi/chi/v5"
)

type Mux struct {
	mux *chi.Mux
}

func NewMux() *Mux {
	return &Mux{
		chi.NewMux(),
	}
}

func (m *Mux) Handle(method string, pattern string, h handler.Handler, middlewares ...handler.Middleware) {
	m.mux.MethodFunc(method, pattern, func(w http.ResponseWriter, r *http.Request) {
		ctx := &handler.Context{R: r, W: w}

		for _, m := range middlewares {
			h = m(h)
		}

		if err := h(ctx); err != nil {
			log.Printf("handle %s: %v", pattern, err)
		}
	})
}

func (m Mux) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	m.mux.ServeHTTP(w, r)
}

func (m *Mux) ServeHTTPContext(ctx *handler.Context) error {
	m.ServeHTTP(ctx.W, ctx.R)
	return ctx.GetError()
}
