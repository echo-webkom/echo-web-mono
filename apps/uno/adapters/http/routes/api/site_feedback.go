package api

import (
	"errors"
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/ports"
	"uno/domain/services"

	_ "uno/domain/model"
)

// GetSiteFeedbacksHandler returns a list of site feedbacks
// @Summary	     Get site feedbacks
// @Tags         feedbacks
// @Produce      json
// @Success      200  {array}  model.SiteFeedback  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /feedbacks [get]
func GetSiteFeedbacksHandler(logger ports.Logger, siteFeedbackService *services.SiteFeedbackService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		feedbacks, err := siteFeedbackService.SiteFeedbackRepo().GetAllSiteFeedbacks(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}
		return util.JsonOk(w, feedbacks)
	}
}

// GetSiteFeedbackByIDHandler returns a site feedback by ID
// @Summary	     Get site feedback by ID
// @Tags         feedbacks
// @Produce      json
// @Param        id   path   string  true  "Feedback ID"
// @Success      200  {object}  model.SiteFeedback  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Security     AdminAPIKey
// @Router       /feedbacks/{id} [get]
func GetSiteFeedbackByIDHandler(logger ports.Logger, siteFeedbackService *services.SiteFeedbackService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		feedbackID := r.PathValue("id")
		if feedbackID == "" {
			return http.StatusBadRequest, errors.New("missing site feedback id")
		}
		feedback, err := siteFeedbackService.SiteFeedbackRepo().GetSiteFeedbackByID(r.Context(), feedbackID)
		if err != nil {
			return http.StatusNotFound, errors.New("site feedback not found")
		}
		return util.JsonOk(w, feedback)
	}
}
