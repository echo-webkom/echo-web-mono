package middleware

import (
	"net/http"
	"strings"
	"time"
	"uno/domain/port"
	"uno/http/handler"

	"github.com/go-chi/chi/v5"
)

// Middleware logging requests and their outcome.
func Logger(portLogger port.Logger) func(http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return handler.Handler(func(ctx *handler.Context) error {
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

var sensitiveParamKeys = []string{
	"email",
	"password",
	"token",
	"api_key",
	"apikey",
	"secret",
	"username",
	"phone",
}

func isSensitiveParam(key string) bool {
	lowerKey := strings.ToLower(key)
	for _, sensitiveKey := range sensitiveParamKeys {
		if strings.Contains(lowerKey, sensitiveKey) {
			return true
		}
	}
	return false
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
	bytes      int
}

func (rw *responseWriter) WriteHeader(statusCode int) {
	rw.statusCode = statusCode
	rw.ResponseWriter.WriteHeader(statusCode)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	n, err := rw.ResponseWriter.Write(b)
	rw.bytes += n
	return n, err
}

// TODO: unused
func RequestLogger(logger port.Logger) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			wrapped := &responseWriter{
				ResponseWriter: w,
				statusCode:     http.StatusOK,
				bytes:          0,
			}

			defer func() {
				if rec := recover(); rec != nil {
					logger.Error(r.Context(), "panic recovered",
						"panic", rec,
						"method", r.Method,
						"path", r.URL.Path,
					)
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				}
			}()

			next.ServeHTTP(wrapped, r)

			routePattern := r.URL.Path
			var params map[string]string
			if rctx := chi.RouteContext(r.Context()); rctx != nil {
				if pattern := rctx.RoutePattern(); pattern != "" {
					routePattern = pattern
				}
				if len(rctx.URLParams.Keys) > 0 {
					params = make(map[string]string, len(rctx.URLParams.Keys))
					for i, key := range rctx.URLParams.Keys {
						// Redact sensitive parameters
						if isSensitiveParam(key) {
							params[key] = "[REDACTED]"
						} else {
							params[key] = rctx.URLParams.Values[i]
						}
					}
				}
			}

			duration := time.Since(start)

			attrs := []any{
				"method", r.Method,
				"route", routePattern,
				"status", wrapped.statusCode,
				"duration_ms", duration.Milliseconds(),
				"bytes", wrapped.bytes,
				"user_agent", r.Header.Get("User-Agent"),
				"remote_addr", r.RemoteAddr,
			}

			if len(params) > 0 {
				attrs = append(attrs, "params", params)
			}

			logger.Info(r.Context(), "http request", attrs...)
		})
	}
}
