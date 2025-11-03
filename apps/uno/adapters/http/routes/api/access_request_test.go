package api_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/services"
	"uno/infrastructure/postgres"

	"github.com/stretchr/testify/assert"
)

// Setup db, repo and service for access request tests
func setupAccessRequestTest(t *testing.T) (*postgres.Database, *services.AccessRequestService) {
	db := postgres.SetupTestDB(t)
	accessRequestRepo := postgres.NewAccessRequestRepo(db, nil)
	accessRequestService := services.NewAccessRequestService(accessRequestRepo)
	return db, accessRequestService
}

// Test getting access requests when none exist
func TestGetAccessRequestsHandler_Empty(t *testing.T) {
	db, accessRequestService := setupAccessRequestTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetAccessRequestsHandler(nil, accessRequestService)

	req := httptest.NewRequest(http.MethodGet, "/access-requests", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var accessRequests []model.AccessRequest
	err = json.NewDecoder(w.Body).Decode(&accessRequests)
	assert.NoError(t, err)
	assert.Len(t, accessRequests, 0)
}

// Test getting access requests when some exist
func TestGetAccessRequestsHandler_WithData(t *testing.T) {
	db, accessRequestService := setupAccessRequestTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	_, err := accessRequestService.AccessRequestRepo().CreateAccessRequest(ctx, model.AccessRequest{
		Email:  "user1@example.com",
		Reason: "Need access for project",
	})
	assert.NoError(t, err)
	_, err = accessRequestService.AccessRequestRepo().CreateAccessRequest(ctx, model.AccessRequest{
		Email:  "user2@example.com",
		Reason: "Student access required",
	})
	assert.NoError(t, err)

	handler := api.GetAccessRequestsHandler(nil, accessRequestService)

	req := httptest.NewRequest(http.MethodGet, "/access-requests", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var accessRequests []model.AccessRequest
	err = json.NewDecoder(w.Body).Decode(&accessRequests)
	assert.NoError(t, err)
	assert.Len(t, accessRequests, 2)

	emails := []string{accessRequests[0].Email, accessRequests[1].Email}
	assert.Contains(t, emails, "user1@example.com")
	assert.Contains(t, emails, "user2@example.com")
}
