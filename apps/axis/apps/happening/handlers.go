package happening

import (
	"errors"
	"net/http"

	"github.com/echo-webkom/axis/apputil"
	"github.com/echo-webkom/axis/service"
	"github.com/go-chi/chi/v5"
)

func listHappenings(h *apputil.Handler) http.HandlerFunc {
	hs := service.NewHappeningService(h.DB)

	return func(w http.ResponseWriter, r *http.Request) {
		happenings, err := hs.GetAllHappenings()
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("failed to fetch happenings"))
			return
		}

		h.JSON(w, http.StatusOK, happenings)
	}
}

func findHappening(h *apputil.Handler) http.HandlerFunc {
	hs := service.NewHappeningService(h.DB)

	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		if id == "" {
			h.Error(w, http.StatusBadRequest, errors.New("missing id"))
			return
		}

		happenings, err := hs.GetHappeningById(id)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("failed to fetch happening"))
			return
		}

		h.JSON(w, http.StatusOK, happenings)
	}
}
