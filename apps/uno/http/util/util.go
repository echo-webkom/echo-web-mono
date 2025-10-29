package util

import (
	"encoding/json"
	"net/http"
)

func JsonOk(w http.ResponseWriter, data any) (int, error) {
	w.Header().Set("Content-Type", "application/json")
	return http.StatusOK, json.NewEncoder(w).Encode(data)
}
