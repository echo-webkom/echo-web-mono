package uno

import (
	"context"
	"net/http"
	"uno/domain/port"

	"github.com/jesperkha/notifier"
)

// Router wraps chi.Mux and provides a simplified API. Routes use the internal
// Handler type. It also implements http.Handler.
type Router struct {
	mux     *Mux
	logger  port.Logger
	cleanup func()
}

func NewRouter(logger port.Logger, middleware ...func(http.Handler) http.Handler) *Router {
	mux := NewMux(middleware...)
	return &Router{mux, logger, func() {}}
}

func (rt *Router) Handle(method string, pattern string, h Handler, middleware ...Middleware) {
	rt.mux.Handle(method, pattern, h, middleware...)
}

func (r *Router) Mount(pattern string, handler http.Handler, middleware ...Middleware) {
	r.mux.Mount(pattern, handler, middleware...)
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

	r.logger.Info(ctx, "server running at http://localhost"+port)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		r.logger.Error(ctx, "error starting http server",
			"error", err,
		)
	}
}

func (rt Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rt.mux.ServeHTTP(w, r)
}
