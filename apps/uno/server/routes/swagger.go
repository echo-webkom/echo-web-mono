package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	httpSwagger "github.com/swaggo/http-swagger"
)

func (r *Router) SwaggerRoutes() http.Handler {
	m := chi.NewMux()

	m.Get("/*", r.swagger)
	m.Get("/doc.json", r.swaggerJSON)

	return m
}

func (rt *Router) swagger(w http.ResponseWriter, r *http.Request) {
	httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	).ServeHTTP(w, r)
}

func (rt *Router) swaggerJSON(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "docs/swagger.json")
}
