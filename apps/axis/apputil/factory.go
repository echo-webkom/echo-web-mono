package apputil

import "github.com/go-chi/chi/v5"

// RouterFactory initializes all app routers by calling a constructor function,
// giving the app Router function the Handler.
type RouterFactory struct {
	Router  chi.Router
	Handler *Handler
}

// RouterConstructor describes the function signature of the only exported
// function in apps, the Router function.
//
// Apps should pass the given handler to each mounted handler, and return
// a new apputil Router with all the apps handlers mounted.
type RouterConstructor func(h *Handler) *Router

// NewRouterFactory initializes and returns a RouterFactory.
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
