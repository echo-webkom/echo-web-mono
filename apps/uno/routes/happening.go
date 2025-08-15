package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (r *Router) HappeningRoutes() http.Handler {
	m := chi.NewMux()

	m.Get("/", r.getHappeningById)

	return m
}

// @Summary Get happening by ID
// @Description Returns the happening with the specified ID
// @Tags happenings
// @Produce json
// @Param id path string true "Happening ID"
// @Success 200
// @Failure 404
// @Router /happenings/{id} [get]
func (rt *Router) getHappeningById(w http.ResponseWriter, r *http.Request) {
	hap, err := rt.hap.GetHappeningByID(r.Context(), r.PathValue("id"))
	if err != nil {
		http.Error(w, "failed to fetch happening", http.StatusNotFound)
		return
	}

	JSON(w, hap)
}
