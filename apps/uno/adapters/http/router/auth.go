package router

import (
	"fmt"
	"net/http"
	"uno/domain/model"
	"uno/services"
)

type Auth struct {
	Session model.Session
	User    model.User
}

type AuthHandler func(w http.ResponseWriter, r *http.Request, auth Auth) (int, error)

func NewWithAuthHandler(as *services.AuthService) func(h AuthHandler) Handler {
	return func(h AuthHandler) Handler {
		return func(w http.ResponseWriter, r *http.Request) (int, error) {
			auth, ok := getAuthFromRequest(as, r)
			if !ok {
				return http.StatusUnauthorized, fmt.Errorf("missing authentication")
			}
			return h(w, r, auth)
		}
	}
}

func NewAuthMiddleware(as *services.AuthService) Middleware {
	return func(h Handler) Handler {
		return func(w http.ResponseWriter, r *http.Request) (int, error) {
			if _, ok := getAuthFromRequest(as, r); !ok {
				return http.StatusUnauthorized, fmt.Errorf("missing authentication")
			}
			return h(w, r)
		}
	}
}

type OptionalAuth struct {
	auth    Auth
	present bool
}

func (o OptionalAuth) Unwrap() (auth Auth, ok bool) {
	return o.auth, o.present
}

type OptionalAuthHandler func(w http.ResponseWriter, r *http.Request, auth OptionalAuth) int

func NewWithOptionalAuthHandler(as *services.AuthService) func(h OptionalAuthHandler) http.HandlerFunc {
	return func(h OptionalAuthHandler) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			auth, ok := getAuthFromRequest(as, r)

			if code := h(w, r, OptionalAuth{auth, ok}); code != http.StatusOK {
				w.WriteHeader(code)
			}
		}
	}
}

func getBearerToken(r *http.Request) string {
	token := r.Header.Get("Authorization")

	if token == "" {
		return ""
	}

	return token[len("Bearer "):]
}

func getAuthFromRequest(as *services.AuthService, r *http.Request) (auth Auth, ok bool) {
	ctx := r.Context()

	token := getBearerToken(r)
	if token == "" {
		return auth, false
	}

	user, session, err := as.ValidateToken(ctx, token)
	if err != nil {
		return auth, false
	}

	return Auth{session, user}, true
}
