package router

import (
	"context"
	"net/http"
	"uno/domain/port"
	"uno/http/handler"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/jesperkha/notifier"
)

// Router wraps chi.Mux and provides a simplified API. Routes use the internal
// Handler function. It also implements http.Handler.
type Router struct {
	mux     *chi.Mux
	logger  port.Logger
	cleanup func()
}

func New(serviceName string, logger port.Logger) *Router {
	mux := chi.NewMux()

	mux.Use(Telemetry(serviceName))
	mux.Use(RequestLogger(logger))
	mux.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Admin-Key"},
		ExposedHeaders:   []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	return &Router{mux, logger, func() {}}
}

func (rt *Router) Handle(method string, pattern string, h handler.Handler, middleware ...handler.Middleware) {
	rt.mux.MethodFunc(method, pattern, func(w http.ResponseWriter, r *http.Request) {
		rctx := r.Context()

		for _, m := range middleware {
			h = m(h)
		}

		ctx := handler.NewContext(w, r)
		err := h(ctx)
		status := ctx.Status()

		if err != nil {
			rt.logger.Error(rctx, "request error",
				"method", method,
				"pattern", pattern,
				"status", status,
				"error", err.Error(),
			)
			http.Error(w, err.Error(), status)
			return
		}

		if status != http.StatusOK {
			w.WriteHeader(status)
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
	ctx := context.Background()
	done, finish := notif.Register()

	server := &http.Server{
		Addr:    port,
		Handler: r.mux,
	}

	go func() {
		<-done
		if err := server.Shutdown(ctx); err != nil {
			r.logger.Error(ctx, "shutdown failed",
				"error", err,
			)
		}

		r.logger.Info(ctx, "http server stopped")
		r.cleanup()
		finish()
	}()

	r.logger.Info(ctx, "listening on http://localhost"+port)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		r.logger.Error(ctx, "error starting http server",
			"error", err,
		)
	}
}

func (rt Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rt.mux.ServeHTTP(w, r)
}
