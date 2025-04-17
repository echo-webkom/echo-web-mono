package api

import (
	"errors"
	"net/http"

	"github.com/echo-webkom/axis/apps/feedback"
	"github.com/echo-webkom/axis/apputil"
)

func FeedbackRouter(h *apputil.Handler) *apputil.Router {
	fs := feedback.New(h.Pool)
	r := apputil.NewRouter()

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

	return r
}
