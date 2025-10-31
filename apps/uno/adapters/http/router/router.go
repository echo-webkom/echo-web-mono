package router

import (
	"context"
	"log"
	"net/http"
	"uno/adapters/http/middleware"

	chiMiddleware "github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/jesperkha/notifier"
)

// Custom Router handler. Returns reuqests status code and error. Handlers
// should not write status codes on their own as it is handled by Router.
// The returned error is written to the response with http.Error.
type Handler func(w http.ResponseWriter, r *http.Request) (int, error)

type Middleware func(Handler) Handler

// Router wraps chi.Mux and provides a simplified API. Routes use the internal
// Handler function. It also implements http.Handler.
type Router struct {
	mux     *chi.Mux
	cleanup func()
}

func New(serviceName string) *Router {
	mux := chi.NewMux()

	mux.Use(middleware.Telemetry(serviceName))
	mux.Use(chiMiddleware.Logger)
	mux.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	return &Router{mux, func() {}}
}

func (r *Router) Handle(method string, pattern string, handler Handler, middleware ...Middleware) {
	r.mux.MethodFunc(method, pattern, func(w http.ResponseWriter, r *http.Request) {
		for _, m := range middleware {
			handler = m(handler)
		}

		status, err := handler(w, r)
		if status != http.StatusOK {
			w.WriteHeader(status)
		}

		if err != nil {
			log.Printf("handle %s: %v", pattern, err)
			http.Error(w, err.Error(), status)
		}
	})
}

// Mount allows mounting a standard http.Handler (useful for swagger, pprof, etc.)
func (r *Router) Mount(pattern string, handler http.Handler) {
	r.mux.Mount(pattern, handler)
}

func (r *Router) OnCleanup(f func()) {
	r.cleanup = f
}

func (r *Router) Serve(notif *notifier.Notifier, port string) {
	done, finish := notif.Register()

	server := &http.Server{
		Addr:    port,
		Handler: r.mux,
	}

	go func() {
		<-done
		if err := server.Shutdown(context.Background()); err != nil {
			log.Println(err)
		}

		log.Println("cleaning up...")
		r.cleanup()
		finish()
	}()

	log.Println("listening on port " + port)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Println(err)
	}
}

func (rt Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rt.mux.ServeHTTP(w, r)
}
