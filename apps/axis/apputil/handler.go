package apputil

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type Handler struct {
	DB *sql.DB
}

type RouterConstructor func(h *Handler) chi.Router

// Encodes the response as JSON and writes it to the http.ResponseWriter
func (h *Handler) JSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}

// Error writes an error message to the http.ResponseWriter
func (h *Handler) Error(w http.ResponseWriter, status int, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Bind decodes the request body into the provided struct
func (h *Handler) Bind(r *http.Request, v any) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(v)
}

type RouterFactory struct {
	Router  chi.Router
	Handler *Handler
}

// NewRouterFactory initializes and returns a RouterFactory
func NewRouterFactory(r chi.Router, h *Handler) *RouterFactory {
	return &RouterFactory{
		Router:  r,
		Handler: h,
	}
}

// Mount wraps chi's Mount, injecting the handler into the router constructor
func (rf *RouterFactory) Mount(pattern string, constructor RouterConstructor) {
	rf.Router.Mount(pattern, constructor(rf.Handler))
}
