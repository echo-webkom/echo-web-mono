package api

import (
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type feedbacks struct {
	logger          port.Logger
	feedbackService *service.SiteFeedbackService
}

func NewSiteFeedbackMux(logger port.Logger, feedbackService *service.SiteFeedbackService, admin handler.Middleware) *router.Mux {
	mux := router.NewMux()
	f := feedbacks{logger, feedbackService}

	// Admin
	mux.Handle("GET", "/", f.GetSiteFeedbacksHandler, admin)
	mux.Handle("GET", "/{id}", f.GetSiteFeedbackByIDHandler, admin)

	return mux
}

// GetSiteFeedbacksHandler returns a list of site feedbacks
// @Summary	     Get site feedbacks
// @Tags         feedbacks
// @Produce      json
// @Success      200  {array}  dto.SiteFeedbackResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /feedbacks [get]
func (f *feedbacks) GetSiteFeedbacksHandler(ctx *handler.Context) error {
	// Fetch feedbacks from the repository
	feedbacks, err := f.feedbackService.SiteFeedbackRepo().GetAllSiteFeedbacks(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTOs
	response := dto.SiteFeedbacksFromDomainList(feedbacks)
	return ctx.JSON(response)
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
func (f *feedbacks) GetSiteFeedbackByIDHandler(ctx *handler.Context) error {
	// Get the feedback ID from the path
	feedbackID := ctx.PathValue("id")
	if feedbackID == "" {
		return ctx.Error(errors.New("missing site feedback id"), http.StatusBadRequest)
	}

	// Fetch feedback with the given ID from the repository
	feedback, err := f.feedbackService.SiteFeedbackRepo().GetSiteFeedbackByID(ctx.Context(), feedbackID)
	if err != nil {
		return ctx.Error(errors.New("site feedback not found"), http.StatusNotFound)
	}

	// Convert to DTO
	response := new(dto.SiteFeedbackResponse).FromDomain(&feedback)
	return ctx.JSON(response)
}
