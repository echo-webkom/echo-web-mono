package api

import (
	"errors"
	"net/http"

	"github.com/echo-webkom/axis/apiutil"
	"github.com/echo-webkom/axis/service/feedback"
)

func FeedbackRouter(h *apiutil.Handler) *apiutil.Router {
	fs := feedback.New(h.Pool)
	r := apiutil.NewRouter()

	// POST /feedback
	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		var feedback feedback.NewFeedbackRequest
		if err := h.Bind(r, &feedback); err != nil {
			h.Error(w, http.StatusBadRequest, errors.New("invalid request"))
			return
		}

		if err := fs.SubmitFeedback(ctx, feedback); err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("internal server error"))
			return
		}

		w.WriteHeader(http.StatusCreated)
	})

	// GET /feedback
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		feedbacks, err := fs.ListFeedback(ctx)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("internal server error"))
			return
		}

		h.JSON(w, http.StatusOK, feedbacks)
	})

	return r
}
