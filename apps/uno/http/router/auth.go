package router

import (
	"context"
	"fmt"
	"net/http"
	"uno/data/model"
)

type Repo interface {
	GetSessionByToken(ctx context.Context, token string) (model.Session, error)
	GetUserById(ctx context.Context, id string) (model.User, error)
}

type Auth struct {
	Session model.Session
	User    model.User
}

type AuthHandler func(w http.ResponseWriter, r *http.Request, auth Auth) (int, error)

func NewWithAuthHandler(repo Repo) func(h AuthHandler) Handler {
	return func(h AuthHandler) Handler {
		return func(w http.ResponseWriter, r *http.Request) (int, error) {
			auth, ok := getAuthFromRequest(repo, r)
			if !ok {
				return http.StatusUnauthorized, fmt.Errorf("missing authentication")
			}
			return h(w, r, auth)
		}
	}
}

func NewAuthMiddleware(repo Repo) Middleware {
	return func(h Handler) Handler {
		return func(w http.ResponseWriter, r *http.Request) (int, error) {
			if _, ok := getAuthFromRequest(repo, r); !ok {
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

func NewWithOptionalAuthHandler(repo Repo) func(h OptionalAuthHandler) http.HandlerFunc {
	return func(h OptionalAuthHandler) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			auth, ok := getAuthFromRequest(repo, r)

			if code := h(w, r, OptionalAuth{auth, ok}); code != http.StatusOK {
				w.WriteHeader(code)
			}
		}
	}
}

func getAuthFromRequest(repo Repo, r *http.Request) (auth Auth, ok bool) {
	ctx := r.Context()

	token := r.Header.Get("Authorization")
	if token == "" {
		return auth, false
	}

	token = token[len("Bearer "):]

	session, err := repo.GetSessionByToken(ctx, token)
	if err != nil {
		return auth, false
	}

	user, err := repo.GetUserById(ctx, session.UserID)
	if err != nil {
		return auth, false
	}

	return Auth{session, user}, true
}
