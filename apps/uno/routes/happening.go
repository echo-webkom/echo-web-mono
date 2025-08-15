package routes

import (
	"net/http"

	"github.com/echo-webkom/uno/app/happening"
	"github.com/go-chi/chi/v5"
)

func HappeningRoutes(service *happening.HappeningService) http.Handler {
	m := chi.NewMux()

	m.Get("/happenings/{id}", func(w http.ResponseWriter, r *http.Request) {
		hap, err := service.GetHappeningByID(r.Context(), r.PathValue("id"))
		if err != nil {
			http.Error(w, "failed to fetch happening", http.StatusNotFound)
			return
		}

		JSON(w, hap)
	})

	return m
}
