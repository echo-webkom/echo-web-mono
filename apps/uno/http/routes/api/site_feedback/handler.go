package sitefeedback

import (
	"errors"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/pkg/uno"
)

type feedbacks struct {
	logger          port.Logger
	feedbackService *service.SiteFeedbackService
}

func NewMux(logger port.Logger, feedbackService *service.SiteFeedbackService, admin uno.Middleware) *uno.Mux {
	mux := uno.NewMux()
	f := feedbacks{logger, feedbackService}

	// Admin
	mux.Handle("GET", "/", f.getSiteFeedbacks, admin)
	mux.Handle("GET", "/{id}", f.getSiteFeedbackByID, admin)
	mux.Handle("POST", "/", f.createSiteFeedback, admin)
	mux.Handle("PUT", "/{id}/seen", f.markSiteFeedbackAsSeen, admin)

	return mux
}

// getSiteFeedbacks returns a list of site feedbacks
// @Summary	     Get site feedbacks
// @Tags         feedbacks
// @Produce      json
// @Success      200  {array}  SiteFeedbackResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Security     AdminAPIKey
// @Router       /feedbacks [get]
func (f *feedbacks) getSiteFeedbacks(ctx *uno.Context) error {
	// Fetch feedbacks from the repository
	feedbacks, err := f.feedbackService.SiteFeedbackRepo().GetAllSiteFeedbacks(ctx.Context())
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTOs
	response := SiteFeedbacksFromDomainList(feedbacks)
	return ctx.JSON(response)
}

// getSiteFeedbackByID returns a site feedback by ID
// @Summary	     Get site feedback by ID
// @Tags         feedbacks
// @Produce      json
// @Param        id   path   string  true  "Feedback ID"
// @Success      200  {object}  SiteFeedbackResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Security     AdminAPIKey
// @Router       /feedbacks/{id} [get]
func (f *feedbacks) getSiteFeedbackByID(ctx *uno.Context) error {
	// Get the feedback ID from the path
	feedbackID := ctx.PathValue("id")

	// Fetch feedback with the given ID from the repository
	feedback, err := f.feedbackService.SiteFeedbackRepo().GetSiteFeedbackByID(ctx.Context(), feedbackID)
	if err != nil {
		return ctx.Error(errors.New("site feedback not found"), http.StatusNotFound)
	}

	// Convert to DTO
	response := NewSiteFeedbackResponseFromDomain(&feedback)
	return ctx.JSON(response)
}

// createSiteFeedback creates a new site feedback
// @Summary	     Create site feedback
// @Tags         feedbacks
// @Accept       json
// @Produce      json
// @Param        feedback  body  CreateSiteFeedbackRequest  true  "Site Feedback"
// @Success      201  {object}  SiteFeedbackResponse  "Created"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Router       /feedbacks [post]
func (f *feedbacks) createSiteFeedback(ctx *uno.Context) error {
	var req CreateSiteFeedbackRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(errors.New("bad request data"), http.StatusBadRequest)
	}

	newFeedback, err := req.ToNewSiteFeedback()
	if err != nil {
		return ctx.Error(err, http.StatusBadRequest)
	}

	// Create a new site feedback in the repository
	feedback, err := f.feedbackService.SiteFeedbackRepo().CreateSiteFeedback(ctx.Context(), newFeedback)
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTO
	response := NewSiteFeedbackResponseFromDomain(&feedback)
	return ctx.JSON(response)
}

// markSiteFeedbackAsSeen updates an existing site feedback
// @Summary	     Update site feedback
// @Tags         feedbacks
// @Accept       json
// @Param        id        path  string  true  "Feedback ID"
// @Success      200  {object}  SiteFeedbackResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "Not Found"
// @Router       /feedbacks/{id}/seen [put]
func (f *feedbacks) markSiteFeedbackAsSeen(ctx *uno.Context) error {
	feedbackID := ctx.PathValue("id")
	if feedbackID == "" {
		return ctx.Error(errors.New("feedback ID is required"), http.StatusBadRequest)
	}

	err := f.feedbackService.SiteFeedbackRepo().MarkSiteFeedbackAsRead(ctx.Context(), feedbackID)
	if err != nil {
		return ctx.Error(errors.New("site feedback not found"), http.StatusNotFound)
	}

	return nil
}
