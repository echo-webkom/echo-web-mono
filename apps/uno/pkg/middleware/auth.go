package middleware

import (
	"net/http"
	"strings"

	"github.com/echo-webkom/uno/config"
)

func AdminAuth(config *config.Config) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := r.Header.Get("Authorization")
			if token == "" {
				http.Error(w, "missing authorization header", http.StatusUnauthorized)
				return
			}

			if !strings.HasPrefix(token, "Bearer ") {
				http.Error(w, "invalid authorization format", http.StatusUnauthorized)
				return
			}

			key := strings.TrimPrefix(token, "Bearer ")
			if key != config.AdminKey {
				http.Error(w, "invalid admin key", http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}