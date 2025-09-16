package routes

import (
	"encoding/json"
	"net/http"
)

func JSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, "failed to write json response", http.StatusInternalServerError)
	}
}
