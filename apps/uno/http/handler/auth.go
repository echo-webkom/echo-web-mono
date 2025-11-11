package handler

import (
	"net/http"
	"uno/domain/model"
	"uno/domain/service"
)

// Create new middleware rejecting any requests without correct authorization token.
func RequireAuthMiddleware(s *service.SessionService) Middleware {
	return func(h Handler) Handler {
		return WithAuth(s, func(ctx *Context, auth model.Auth) error {
			return h(ctx)
		})
	}
}

type AuthHandler func(ctx *Context, auth model.Auth) error

// Wrap a AuthHandler to reject unauthorized requests, and pass auth to the
// handler when provided.
func WithAuth(s *service.SessionService, h AuthHandler) Handler {
	return func(ctx *Context) error {
		auth, ok := getAuthFromRequest(s, ctx.R)
		if !ok {
			return ctx.Error("not authorized", http.StatusUnauthorized)
		}
		return h(ctx, auth)
	}
}

type OptionalAuthHandler func(ctx *Context, auth OptionalAuth) error

type OptionalAuth struct {
	auth    model.Auth
	present bool
}

func (o OptionalAuth) Unwrap() (auth model.Auth, ok bool) {
	return o.auth, o.present
}

func WithOptionalAuth(s *service.SessionService, h OptionalAuthHandler) Handler {
	return func(ctx *Context) error {
		auth, ok := getAuthFromRequest(s, ctx.R)
		return h(ctx, OptionalAuth{auth, ok})
	}
}

func getAuthFromRequest(s *service.SessionService, r *http.Request) (auth model.Auth, ok bool) {
	token := r.Header.Get("Authorization")
	if token == "" {
		return auth, false
	}

	token = token[len("Bearer "):]

	auth, err := s.GetAuthFromSessionToken(r.Context(), token)
	return auth, err == nil
}
