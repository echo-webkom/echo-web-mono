package api

import (
	"errors"
	"net/http"

	"github.com/echo-webkom/axis/apiutil"
	"github.com/echo-webkom/axis/service/registration"
	"github.com/go-chi/chi/v5"
)

func RegistrationsRouter(h *apiutil.Handler) *apiutil.Router {
	r := apiutil.NewRouter()
	rs := registration.New(h.Pool, h.Client)

	// GET /registrations/{id}/count
	r.Get("/{id}/count", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		id := chi.URLParam(r, "id")
		if id == "" {
			h.Error(w, http.StatusBadRequest, errors.New("missing id"))
			return
		}

		count, err := rs.Count(ctx, id)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("failed to count registrations"))
			return
		}

		h.JSON(w, http.StatusOK, count)
	})

	// POST /registrations/{id}
	r.Post("/{id}", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		id := chi.URLParam(r, "id")
		if id == "" {
			h.Error(w, http.StatusBadRequest, errors.New("missing id"))
			return
		}

		var body registration.RequestBody
		if err := h.Bind(r, &body); err != nil {
			h.Error(w, http.StatusBadRequest, errors.New("failed to bind request body"))
			return
		}

		if err := body.Validate(); err != nil {
			h.Error(w, http.StatusBadRequest, err)
			return
		}

		status, err := rs.Register(ctx, body.UserID, id, body.Questions)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("failed to register"))
			return
		}

		h.JSON(w, http.StatusOK, map[string]string{
			"status": string(status),
		})
	})

	return r
}
