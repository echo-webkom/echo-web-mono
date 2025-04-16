package apputil

import "github.com/go-chi/chi/v5"

type RouterFactory struct {
	Router  chi.Router
	Handler *Handler
}

type RouterConstructor func(h *Handler) *Router

// NewRouterFactory initializes and returns a RouterFactory
func NewRouterFactory(r chi.Router, h *Handler) *RouterFactory {
	return &RouterFactory{
		Router:  r,
		Handler: h,
	}
}

// Mount wraps chi's Mount, injecting the handler into the router constructor
func (rf *RouterFactory) Mount(pattern string, constructor RouterConstructor) {
	rf.Router.Mount(pattern, constructor(rf.Handler))
}
