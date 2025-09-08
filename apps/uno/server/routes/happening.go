package routes

import (
	"net/http"

	"github.com/echo-webkom/uno/pkg/middleware"
	"github.com/go-chi/chi/v5"
)

func (r *Router) HappeningRoutes() http.Handler {
	m := chi.NewMux()
	m.Use(middleware.AdminAuth(r.config))

	m.Get("/{slug}", r.getHappeningById)

	return m
}

// @Summary Get happening by slug
// @Description Returns the happening with the specified slug
// @Tags happenings
// @Produce json
// @Param id path string true "Happening slug"
// @Success 200
// @Failure 404
// @Router /happenings/{slug} [get]
// @Security admin-token
func (rt *Router) getHappeningById(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	slug := r.PathValue("slug")

	hap, err := rt.hap.GetHappeningBySlug(ctx, slug)
	if err != nil {
		http.Error(w, "failed to fetch happening", http.StatusNotFound)
		return
	}

	JSON(w, hap)
}
