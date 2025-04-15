package happening

import (
	"encoding/json"
	"net/http"

	"github.com/echo-webkom/axis/apputil"
	"github.com/echo-webkom/axis/storage/database"
	"github.com/go-chi/chi/v5"
)

type happening struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

func ListHappenings(h *apputil.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		happenings, err := database.GetAllHappenings(h.DB)
		if err != nil {
			http.Error(w, "Failed to fetch happenings", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(happenings); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

func FindHappening(h *apputil.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		if id == "" {
			http.Error(w, "Missing ID", http.StatusBadRequest)
			return
		}

		happenings, err := database.GetHappeningById(h.DB, id)
		if err != nil {
			http.Error(w, "Failed to fetch happenings", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(happenings); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}
