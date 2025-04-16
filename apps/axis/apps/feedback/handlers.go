package feedback

import (
	"net/http"

	"github.com/echo-webkom/axis/apputil"
	"github.com/echo-webkom/axis/service"
)

func createFeedback(h *apputil.Handler) http.HandlerFunc {
	fs := service.NewFeedbackService(h.DB)

	return func(w http.ResponseWriter, r *http.Request) {
		var feedback service.NewFeedbackRequest
		if err := h.Bind(r, &feedback); err != nil {
			h.Error(w, http.StatusBadRequest, err)
			return
		}

		if err := fs.SubmitFeedback(feedback); err != nil {
			h.Error(w, http.StatusInternalServerError, err)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
