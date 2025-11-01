package api

import (
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
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
func GetSiteFeedbacksHandler(siteFeedbackService *services.SiteFeedbackService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		feedbacks, err := siteFeedbackService.Queries().GetAllSiteFeedbacks(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
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
func GetSiteFeedbackByIDHandler(siteFeedbackService *services.SiteFeedbackService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		feedbackID := r.PathValue("id")
		feedback, err := siteFeedbackService.Queries().GetSiteFeedbackByID(r.Context(), feedbackID)
		if err != nil {
			return http.StatusNotFound, err
		}
		return util.JsonOk(w, feedback)
	}
}
