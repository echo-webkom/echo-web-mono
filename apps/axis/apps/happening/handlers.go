package happening

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/echo-webkom/axis/apputil"
	"github.com/go-chi/chi/v5"
)

type happening struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

func ListHappenings(h *apputil.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := h.DB.Query("SELECT id, title FROM happening")
		if err != nil {
			log.Default().Println("Error querying database:", err)
			http.Error(w, "Database query failed", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		happenings := make([]happening, 0)
		for rows.Next() {
			var evt happening
			if err := rows.Scan(&evt.ID, &evt.Title); err != nil {
				http.Error(w, "Failed to scan row", http.StatusInternalServerError)
				return
			}
			happenings = append(happenings, evt)
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

		row := h.DB.QueryRow("SELECT id, title FROM happening WHERE id = ?", id)
		var evt happening
		if err := row.Scan(&evt.ID, &evt.Title); err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Happening not found", http.StatusNotFound)
			} else {
				log.Default().Println("Error querying database:", err)
				http.Error(w, "Database query failed", http.StatusInternalServerError)
			}
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(evt); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}
