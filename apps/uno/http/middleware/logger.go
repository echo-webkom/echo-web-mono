package middleware

import (
	"net"
	"net/http"
	"strings"
	"time"
	"uno/domain/port"
	"uno/http/handler"
	"uno/infrastructure/logging"

	"github.com/go-chi/chi/v5"
)

// Middleware logging requests and their outcome.
func Logger(portLogger port.Logger) func(http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return handler.Handler(func(ctx *handler.Context) error {
			start := time.Now()

			// Attach trace and span IDs to the request context for structured logging.
			reqCtx := logging.WithTraceID(ctx.Context(), logging.GenerateTraceID())
			ctx.SetContext(reqCtx)

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

			attrs := []any{
				"method", ctx.R.Method,
				"route", extractRoute(ctx.R),
				"status", ctx.Status(),
				"latency", time.Since(start).String(),
				"bytes_out", ctx.Bytes(),
				"ip", extractClientIP(ctx.R),
				"user_agent", ctx.R.UserAgent(),
			}

			for k, v := range extractPathParams(ctx.R) {
				attrs = append(attrs, k, v)
			}

			if size := ctx.R.ContentLength; size > 0 {
				attrs = append(attrs, "bytes_in", size)
			}
			if ref := ctx.R.Referer(); ref != "" {
				attrs = append(attrs, "referer", ref)
			}

			if err != nil {
				attrs = append(attrs, "error", err.Error())
				portLogger.Error(ctx.Context(), "request failed", attrs...)
			} else {
				portLogger.Info(ctx.Context(), "request completed", attrs...)
				if time.Since(start) > 1*time.Second {
					portLogger.Warn(ctx.Context(), "slow request", attrs...)
				}
			}

			return err
		})
	}
}

// sensitivePathParam reports whether a path param name should be redacted from logs.
func sensitivePathParam(name string) bool {
	lower := strings.ToLower(name)
	for _, word := range []string{"secret", "token", "key", "password", "pass"} {
		if strings.Contains(lower, word) {
			return true
		}
	}
	return false
}

// extractPathParams returns non-sensitive chi URL path parameters as a map.
func extractPathParams(r *http.Request) map[string]string {
	rctx := chi.RouteContext(r.Context())
	if rctx == nil {
		return nil
	}
	params := rctx.URLParams
	result := make(map[string]string, len(params.Keys))
	for i, key := range params.Keys {
		if key == "*" {
			continue
		}
		if !sensitivePathParam(key) {
			result[key] = params.Values[i]
		}
	}
	return result
}

// extractRoute returns the matched chi route pattern for the request
func extractRoute(r *http.Request) string {
	if rctx := chi.RouteContext(r.Context()); rctx != nil {
		if p := rctx.RoutePattern(); p != "" {
			return p
		}
	}
	return r.URL.Path
}

// extractClientIP tries to determine the client's IP address by checking common headers
// falls back to the remote address if no headers are found
func extractClientIP(r *http.Request) string {
	if forwardedFor := r.Header.Get("X-Forwarded-For"); forwardedFor != "" {
		if ip, _, found := strings.Cut(forwardedFor, ","); found {
			return strings.TrimSpace(ip)
		}
		return strings.TrimSpace(forwardedFor)
	}
	if realIP := r.Header.Get("X-Real-IP"); realIP != "" {
		return realIP
	}
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}
