package api

import (
	"encoding/json"
	"net/http"
	"uno/adapters/http/router"
	"uno/services"

	_ "uno/domain/model"
)

// GetSiteFeedbacksHandler returns a list of site feedbacks
// @Summary	     Get site feedbacks
// @Tags         feedbacks
// @Produce      json
// @Success      200  {array}  model.SiteFeedback  "OK"
// @Failure      401  {type}  string  "Unauthorized"
// @Router       /feedbacks [get]
func GetSiteFeedbacksHandler(siteFeedbackService *services.SiteFeedbackService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		feedbacks, err := siteFeedbackService.GetAllSiteFeedbacks(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
		}
		return http.StatusOK, json.NewEncoder(w).Encode(feedbacks)
	}
}

// GetSiteFeedbackByIDHandler returns a site feedback by ID
// @Summary	     Get site feedback by ID
// @Tags         feedbacks
// @Produce      json
// @Param        id   path   string  true  "Feedback ID"
// @Success      200  {object}  model.SiteFeedback  "OK"
// @Failure      401  {type}  string  "Unauthorized"
// @Failure      404  {type}  string  "Not Found"
// @Router       /feedbacks/{id} [get]
func GetSiteFeedbackByIDHandler(siteFeedbackService *services.SiteFeedbackService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		feedbackID := r.URL.Query().Get("id")
		feedback, err := siteFeedbackService.GetSiteFeedbackByID(r.Context(), feedbackID)
		if err != nil {
			return http.StatusNotFound, err
		}
		return http.StatusOK, json.NewEncoder(w).Encode(feedback)
	}
}
