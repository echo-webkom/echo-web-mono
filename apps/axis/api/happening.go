package api

import (
	"errors"
	"net/http"

	"github.com/echo-webkom/axis/apiutil"
	"github.com/echo-webkom/axis/service/happening"
	"github.com/go-chi/chi/v5"
)

func HappeningRouter(h *apiutil.Handler) *apiutil.Router {
	r := apiutil.NewRouter()
	hs := happening.New(h.Pool)

	// GET /happening
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		happenings, err := hs.GetAllHappenings(ctx)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("failed to fetch happenings"))
			return
		}

		h.JSON(w, http.StatusOK, happenings)

	})

	// GET /happening/{id}
	r.Get("/{id}", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		id := chi.URLParam(r, "id")
		if id == "" {
			h.Error(w, http.StatusBadRequest, errors.New("missing id"))
			return
		}

		happenings, err := hs.GetHappeningById(ctx, id)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("failed to fetch happening"))
			return
		}

		h.JSON(w, http.StatusOK, happenings)
	})

	return r
}
