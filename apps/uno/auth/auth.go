package auth

import (
	"net/http"
	"uno/data/model"
)

type Repo interface {
	GetSessionByToken(token string) (model.Session, error)
	GetUserById(id string) (model.User, error)
}

type Auth struct {
	Session model.Session
	User    model.User
}

type AuthHandler func(w http.ResponseWriter, r *http.Request, auth Auth) int

func NewWithAuthHandler(repo Repo) func(h AuthHandler) http.HandlerFunc {
	return func(h AuthHandler) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			auth, ok := getAuthFromRequest(repo, r)
			if !ok {
				return
			}

			if code := h(w, r, auth); code != http.StatusOK {
				w.WriteHeader(code)
			}
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
	token := r.Header.Get("Authorization")
	if token == "" {
		return auth, false
	}

	token = token[len("Bearer "):]

	session, err := repo.GetSessionByToken(token)
	if err != nil {
		return auth, false
	}

	user, err := repo.GetUserById(session.UserID)
	if err != nil {
		return auth, false
	}

	return Auth{session, user}, true
}
