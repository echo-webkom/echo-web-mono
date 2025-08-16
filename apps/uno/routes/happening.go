package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (r *Router) HappeningRoutes() http.Handler {
	m := chi.NewMux()

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
func (rt *Router) getHappeningById(w http.ResponseWriter, r *http.Request) {
	hap, err := rt.hap.GetHappeningBySlug(r.Context(), r.PathValue("slug"))
	if err != nil {
		http.Error(w, "failed to fetch happening", http.StatusNotFound)
		return
	}

	JSON(w, hap)
}
