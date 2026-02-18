package middleware

import (
	"fmt"
	"log/slog"
	"net/http"
	"slices"
	"strings"
	"uno/domain/model"
	"uno/domain/service"
	"uno/http/handler"

	"github.com/go-chi/httplog/v3"
)

type slogKey string

const (
	slogKeyIsAdmin slogKey = "is_admin"
	slogKeyUserID  slogKey = "user_id"
)

var bearerTokenPrefix = "Bearer "

// NewAdminMiddleware checks for the presence of a valid admin API key in the
// request header or if the user that does the request is a part of the
// webkom group.
func NewAdminMiddleware(authService *service.AuthService, adminAPIKey string) handler.Middleware {
	return func(h http.Handler) http.Handler {
		return handler.Handler(func(ctx *handler.Context) error {
			if hasValidAdminAPIKey(ctx, adminAPIKey) {
				setAdminAttributes(ctx)
				return ctx.Next(h)
			}

			user, session, err := validateSessionRequest(ctx, authService)
			if err != nil {
				return ctx.Error(fmt.Errorf("missing or invalid admin API key"), http.StatusUnauthorized)
			}

			groups, err := authService.UserRepo().GetUserMemberships(ctx.Context(), user.ID)
			// only webkom is allowed to access admin endpoints with their session token
			if err == nil && slices.Contains(groups, "webkom") {
				setSessionContext(ctx, user, session)
				return ctx.Next(h)
			}

			return ctx.Error(fmt.Errorf("missing or invalid admin API key"), http.StatusUnauthorized)
		})
	}
}

// NewSessionMiddleware validates the presence of a valid session token in the
// request. If valid, it sets the user and session information in the context.
func NewSessionMiddleware(authService *service.AuthService) handler.Middleware {
	return func(h http.Handler) http.Handler {
		return handler.Handler(func(ctx *handler.Context) error {
			user, session, err := validateSessionRequest(ctx, authService)
			if err != nil {
				return ctx.Error(err, http.StatusUnauthorized)
			}

			setSessionContext(ctx, user, session)
			return ctx.Next(h)
		})
	}
}

// NewAdminOrSessionMiddleware allows access if either a valid admin API key is
// provided or a valid session token is present in the request. Sets the
// appropriate context attributes based on the authentication method used.
func NewAdminOrSessionMiddleware(authService *service.AuthService, adminAPIKey string) handler.Middleware {
	return func(h http.Handler) http.Handler {
		return handler.Handler(func(ctx *handler.Context) error {
			if hasValidAdminAPIKey(ctx, adminAPIKey) {
				setAdminAttributes(ctx)
				return ctx.Next(h)
			}

			user, session, err := validateSessionRequest(ctx, authService)
			if err != nil {
				return ctx.Error(fmt.Errorf("unauthorized access"), http.StatusUnauthorized)
			}

			setSessionContext(ctx, user, session)
			return ctx.Next(h)
		})
	}
}

// hasValidAdminAPIKey checks if the request contains a valid admin API key in the
// "X-Admin-Key" header.
func hasValidAdminAPIKey(ctx *handler.Context, adminAPIKey string) bool {
	if adminAPIKey == "" {
		return false
	}
	return ctx.HeaderValue(handler.XAdminKeyHeader) == adminAPIKey
}

// bearerTokenFromHeader extracts the bearer token from the "Authorization" header.
// Also handles the case where the token is prefixed with "Bearer ".
func bearerTokenFromHeader(ctx *handler.Context) (string, error) {
	token := ctx.HeaderValue(handler.AuthorizationHeader)
	if token == "" {
		return "", fmt.Errorf("missing authorization token")
	}

	if after, ok := strings.CutPrefix(token, bearerTokenPrefix); ok {
		token = after
	}

	return token, nil
}

// validateSessionRequest validates the session token from the request and
// returns the associated user and session information if the token is valid.
func validateSessionRequest(ctx *handler.Context, authService *service.AuthService) (model.User, model.Session, error) {
	token, err := bearerTokenFromHeader(ctx)
	if err != nil {
		return model.User{}, model.Session{}, err
	}

	user, session, err := authService.ValidateToken(ctx.Context(), token)
	if err != nil {
		return model.User{}, model.Session{}, fmt.Errorf("invalid token: %w", err)
	}

	return user, session, nil
}

// setAdminAttributes sets logging attributes to indicate that the request is
// authenticated as an admin.
func setAdminAttributes(ctx *handler.Context) {
	httplog.SetAttrs(ctx.Context(), slog.String(string(slogKeyIsAdmin), "true"))
}

// setSessionContext sets the user and session information in the context and adds
// logging attributes for the user ID.
func setSessionContext(ctx *handler.Context, user model.User, session model.Session) {
	nextCtx := handler.WithUser(ctx.Context(), user)
	nextCtx = handler.WithSession(nextCtx, session)
	ctx.SetContext(nextCtx)

	httplog.SetAttrs(ctx.Context(), slog.String(string(slogKeyUserID), user.ID))
}
