package util

import (
	"encoding/json"
	"net/http"
)

func Json(w http.ResponseWriter, status int, data any) (int, error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return status, json.NewEncoder(w).Encode(data)
}

func JsonOk(w http.ResponseWriter, data any) (int, error) {
	return Json(w, http.StatusOK, data)
}

func ReadJson(r *http.Request, data any) error {
	return json.NewDecoder(r.Body).Decode(data)
}
