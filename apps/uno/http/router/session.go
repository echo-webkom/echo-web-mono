package router

import (
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"uno/domain/service"
	"uno/http/handler"

	"github.com/go-chi/httplog/v3"
)

func NewSessionMiddleware(authService service.AuthService) handler.Middleware {
	return func(h http.Handler) http.Handler {
		return handler.Handler(func(ctx *handler.Context) error {
			token := ctx.HeaderValue("Authorization")
			if token == "" {
				return ctx.Error(fmt.Errorf("missing authorization token"), http.StatusUnauthorized)
			}

			if strings.HasPrefix(token, "Bearer ") {
				token = strings.TrimPrefix(token, "Bearer ")
			}

			user, session, err := authService.ValidateToken(ctx.Context(), token)
			if err != nil {
				return ctx.Error(fmt.Errorf("invalid token: %w", err), http.StatusUnauthorized)
			}

			nextCtx := handler.WithUser(ctx.Context(), user)
			nextCtx = handler.WithSession(nextCtx, session)
			ctx.SetContext(nextCtx)

			httplog.SetAttrs(ctx.Context(),
				slog.String("user_id", user.ID),
			)
			return ctx.Next(h)
		})
	}
}
