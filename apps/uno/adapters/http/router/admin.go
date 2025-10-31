package router

import (
	"fmt"
	"net/http"
)

func NewAdminMiddleware(adminAPIKey string) Middleware {
	return func(h Handler) Handler {
		return func(w http.ResponseWriter, r *http.Request) (int, error) {
			if token := getAdminKey(r); token != adminAPIKey {
				return http.StatusUnauthorized, fmt.Errorf("missing or invalid admin API key")
			}
			return h(w, r)
		}
	}
}

func getAdminKey(r *http.Request) string {
	return r.Header.Get("X-Admin-Key")
}
