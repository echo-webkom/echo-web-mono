package router

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/go-chi/httplog/v3"
)

func NewAdminMiddleware(adminAPIKey string) Middleware {
	return func(h Handler) Handler {
		return func(w http.ResponseWriter, r *http.Request) (int, error) {
			ctx := r.Context()

			if token := getAdminKey(r); token != adminAPIKey {
				return http.StatusUnauthorized, fmt.Errorf("missing or invalid admin API key")
			}

			httplog.SetAttrs(ctx, slog.String("is_admin", "true"))

			return h(w, r)
		}
	}
}

func getAdminKey(r *http.Request) string {
	return r.Header.Get("X-Admin-Key")
}
