package router

import (
	"fmt"
	"log/slog"
	"net/http"
	"uno/http/handler"

	"github.com/go-chi/httplog/v3"
)

func NewAdminMiddleware(adminAPIKey string) handler.Middleware {
	return func(h handler.Handler) handler.Handler {
		return func(ctx *handler.Context) error {
			if token := ctx.HeaderValue("X-Admin-Key"); token != adminAPIKey {
				return ctx.Error(fmt.Errorf("missing or invalid admin API key"), http.StatusUnauthorized)
			}

			httplog.SetAttrs(ctx.Context(), slog.String("is_admin", "true"))
			return h(ctx)
		}
	}
}
