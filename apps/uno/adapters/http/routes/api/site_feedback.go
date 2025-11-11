package api

import (
	"errors"
	"net/http"
	"uno/adapters/http/dto"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/ports"
	"uno/domain/service"
)

// GetSiteFeedbacksHandler returns a list of site feedbacks
// @Summary	     Get site feedbacks
// @Tags         feedbacks
// @Produce      json
// @Success      200  {array}  dto.SiteFeedbackResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /feedbacks [get]
func GetSiteFeedbacksHandler(logger ports.Logger, siteFeedbackService *service.SiteFeedbackService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		// Fetch feedbacks from the repository
		feedbacks, err := siteFeedbackService.SiteFeedbackRepo().GetAllSiteFeedbacks(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Convert to DTOs
		response := dto.SiteFeedbacksFromDomainList(feedbacks)

		return util.JsonOk(w, response)
	}
}

// GetSiteFeedbackByIDHandler returns a site feedback by ID
// @Summary	     Get site feedback by ID
// @Tags         feedbacks
// @Produce      json
// @Param        id   path   string  true  "Feedback ID"
// @Success      200  {object}  dto.SiteFeedbackResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Security     AdminAPIKey
// @Router       /feedbacks/{id} [get]
func GetSiteFeedbackByIDHandler(logger ports.Logger, siteFeedbackService *service.SiteFeedbackService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		// Get the feedback ID from the path
		feedbackID := r.PathValue("id")
		if feedbackID == "" {
			return http.StatusBadRequest, errors.New("missing site feedback id")
		}

		// Fetch feedback with the given ID from the repository
		feedback, err := siteFeedbackService.SiteFeedbackRepo().GetSiteFeedbackByID(r.Context(), feedbackID)
		if err != nil {
			return http.StatusNotFound, errors.New("site feedback not found")
		}

		// Convert to DTO
		response := new(dto.SiteFeedbackResponse).FromDomain(&feedback)

		return util.JsonOk(w, response)
	}
}
