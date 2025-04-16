package apputil

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type Handler struct {
	DB *sql.DB
}

// JSON encodes the response as json and writes to the http.ResponseWriter.
// Serves status 500 on failed encoding.
func (h *Handler) JSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Error writes an error message to the http.ResponseWriter.
func (h *Handler) Error(w http.ResponseWriter, status int, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Bind decodes the request body into the provided struct.
func (h *Handler) Bind(r *http.Request, v any) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(v)
}
