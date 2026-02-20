package uno

import "net/http"

type Handler func(ctx *Context) error

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := ReuseOrNewContext(w, r)
	_ = h(ctx)
}

type Middleware func(h http.Handler) http.Handler

func NoMiddleware(h http.Handler) http.Handler {
	return h
}
