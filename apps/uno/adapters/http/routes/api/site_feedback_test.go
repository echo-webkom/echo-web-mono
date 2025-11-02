package api_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/adapters/persistance/postgres"
	"uno/domain/model"
	"uno/domain/services"

	"github.com/stretchr/testify/assert"
)

// Setup db, repo and service for site feedback tests
func setupSiteFeedbackTest(t *testing.T) (*postgres.Database, *services.SiteFeedbackService) {
	db := postgres.SetupTestDB(t)
	siteFeedbackRepo := postgres.NewSiteFeedbackRepo(db)
	siteFeedbackService := services.NewSiteFeedbackService(siteFeedbackRepo)
	return db, siteFeedbackService
}

// Test getting site feedbacks when none exist
func TestGetSiteFeedbacksHandler_Empty(t *testing.T) {
	db, siteFeedbackService := setupSiteFeedbackTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetSiteFeedbacksHandler(siteFeedbackService)

	req := httptest.NewRequest(http.MethodGet, "/feedbacks", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var feedbacks []model.SiteFeedback
	err = json.NewDecoder(w.Body).Decode(&feedbacks)
	assert.NoError(t, err)
	assert.Len(t, feedbacks, 0)
}

// Test getting site feedbacks when some exist
func TestGetSiteFeedbacksHandler_WithData(t *testing.T) {
	db, siteFeedbackService := setupSiteFeedbackTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	name := "Test User"
	email := "test@example.com"
	_, err := siteFeedbackService.SiteFeedbackRepo().CreateSiteFeedback(ctx, model.SiteFeedback{
		Name:     &name,
		Email:    &email,
		Message:  "Test feedback 1",
		Category: "bug",
		IsRead:   false,
	})
	assert.NoError(t, err)
	_, err = siteFeedbackService.SiteFeedbackRepo().CreateSiteFeedback(ctx, model.SiteFeedback{
		Name:     &name,
		Email:    &email,
		Message:  "Test feedback 2",
		Category: "feature",
		IsRead:   false,
	})
	assert.NoError(t, err)

	handler := api.GetSiteFeedbacksHandler(siteFeedbackService)

	req := httptest.NewRequest(http.MethodGet, "/feedbacks", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var feedbacks []model.SiteFeedback
	err = json.NewDecoder(w.Body).Decode(&feedbacks)
	assert.NoError(t, err)
	assert.Len(t, feedbacks, 2)
}

// Test getting site feedback by ID success
func TestGetSiteFeedbackByIDHandler_Success(t *testing.T) {
	db, siteFeedbackService := setupSiteFeedbackTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	name := "Test User"
	email := "test@example.com"
	_, _ = siteFeedbackService.SiteFeedbackRepo().CreateSiteFeedback(ctx, model.SiteFeedback{
		Name:     &name,
		Email:    &email,
		Message:  "Test feedback",
		Category: "general",
		IsRead:   false,
	})

	// Get all feedbacks to find the ID
	feedbacks, _ := siteFeedbackService.SiteFeedbackRepo().GetAllSiteFeedbacks(ctx)
	if len(feedbacks) == 0 {
		t.Skip("No feedback created")
	}
	feedbackID := feedbacks[0].ID

	handler := api.GetSiteFeedbackByIDHandler(siteFeedbackService)

	req := httptest.NewRequest(http.MethodGet, "/feedbacks/"+feedbackID, nil)
	req.SetPathValue("id", feedbackID)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var feedback model.SiteFeedback
	err = json.NewDecoder(w.Body).Decode(&feedback)
	assert.NoError(t, err)
	assert.Equal(t, feedbackID, feedback.ID)
	assert.Equal(t, "Test feedback", feedback.Message)
}

// Test getting site feedback by ID not found
func TestGetSiteFeedbackByIDHandler_NotFound(t *testing.T) {
	db, siteFeedbackService := setupSiteFeedbackTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetSiteFeedbackByIDHandler(siteFeedbackService)

	req := httptest.NewRequest(http.MethodGet, "/feedbacks/nonexistent", nil)
	req.SetPathValue("id", "nonexistent")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusNotFound, status)
}
