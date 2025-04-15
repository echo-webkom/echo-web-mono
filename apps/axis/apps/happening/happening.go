package happening

import (
	"net/http"

	"github.com/echo-webkom/axis/server/handler"
	"github.com/go-chi/chi/v5"
)

func Router(h *handler.Handler) chi.Router {
	r := chi.NewRouter()

	r.Get("/", Home(h))

	return r
}

func Home(h *handler.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello from Happening! 🚀"))
	}
}
