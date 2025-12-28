package router

import (
	"net/http"
	"strings"
	"time"
	"uno/domain/ports"

	"github.com/go-chi/chi/v5"
)

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

func RequestLogger(logger ports.Logger) func(next http.Handler) http.Handler {
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
