package handler

import (
	"net/http"
	"time"
	"uno/domain/port"
	"uno/infrastructure/logging"
)

// Middleware logging requests and their outcome.
func Logger(portLogger port.Logger) func(http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return Handler(func(ctx *Context) error {
			// Set logger trace context
			span := ctx.R.Method + " " + ctx.R.URL.String()
			ctx.SetContext(logging.ContextWithTrace(ctx.Context(), span))

			start := time.Now()

			defer func() {
				if rec := recover(); rec != nil {
					portLogger.Error(ctx.Context(), "panic recovered",
						"panic", rec,
						"method", ctx.R.Method,
						"path", ctx.R.URL.Path,
					)
					http.Error(ctx, "Internal Server Error", http.StatusInternalServerError)
				}
			}()

			err := ctx.Next(h)

			if err != nil {
				portLogger.Error(ctx.Context(), "request failed",
					"method", ctx.R.Method,
					"url", ctx.R.URL.String(),
					"latency", time.Since(start).String(),
					"status", ctx.Status(),
					"bytes", ctx.Bytes(),
					"error", err.Error(),
				)
			} else {
				portLogger.Info(ctx.Context(), "request completed",
					"method", ctx.R.Method,
					"url", ctx.R.URL.String(),
					"latency", time.Since(start).String(),
					"status", ctx.Status(),
					"bytes", ctx.Bytes(),
				)
			}

			return err
		})
	}
}
