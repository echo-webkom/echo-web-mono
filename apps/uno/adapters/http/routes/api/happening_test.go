package api_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
	"uno/adapters/http/routes/api"
	"uno/adapters/persistance/postgres"
	"uno/domain/model"
	"uno/domain/services"

	"github.com/stretchr/testify/assert"
)

// Setup db, repo and service for happening tests
func setupHappeningTest(t *testing.T) (*postgres.Database, *services.HappeningService) {
	db := postgres.SetupTestDB(t)
	happeningRepo := postgres.NewHappeningRepo(db)
	userRepo := postgres.NewUserRepo(db)
	registrationRepo := postgres.NewRegistrationRepo(db)
	banInfoRepo := postgres.NewBanInfoRepo(db)
	happeningService := services.NewHappeningService(happeningRepo, userRepo, registrationRepo, banInfoRepo)
	return db, happeningService
}

// Test getting happenings when none exist
func TestGetHappeningsHandler_Empty(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetHappeningsHandler(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var happenings []model.Happening
	err = json.NewDecoder(w.Body).Decode(&happenings)
	assert.NoError(t, err)
	assert.Len(t, happenings, 0)
}

// Test getting happenings when some exist
func TestGetHappeningsHandler_WithData(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	_, _ = happeningService.HappeningRepo().CreateHappening(ctx, model.Happening{
		Slug:  "test-happening-1",
		Title: "Test Happening 1",
		Type:  "event",
		Date:  &date,
	})
	_, _ = happeningService.HappeningRepo().CreateHappening(ctx, model.Happening{
		Slug:  "test-happening-2",
		Title: "Test Happening 2",
		Type:  "bedpres",
		Date:  &date,
	})

	handler := api.GetHappeningsHandler(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var happenings []model.Happening
	err = json.NewDecoder(w.Body).Decode(&happenings)
	assert.NoError(t, err)
	assert.Len(t, happenings, 2)
}

// Test getting happening by ID success
func TestGetHappeningById_Success(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening, _ := happeningService.HappeningRepo().CreateHappening(ctx, model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	})

	handler := api.GetHappeningById(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/"+happening.ID, nil)
	req.SetPathValue("id", happening.ID)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var result model.Happening
	err = json.NewDecoder(w.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Equal(t, happening.ID, result.ID)
	assert.Equal(t, "Test Happening", result.Title)
}

// Test getting happening by ID with missing ID
func TestGetHappeningById_MissingID(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetHappeningById(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}

// Test getting happening by ID not found
func TestGetHappeningById_NotFound(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetHappeningById(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/nonexistent", nil)
	req.SetPathValue("id", "nonexistent")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusNotFound, status)
}

// Test getting happening registrations count
func TestGetHappeningRegistrationsCount_Empty(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening, _ := happeningService.HappeningRepo().CreateHappening(ctx, model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	})

	handler := api.GetHappeningRegistrationsCount(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/"+happening.ID+"/registrations/count", nil)
	req.SetPathValue("id", happening.ID)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var result api.GroupedRegistration
	err = json.NewDecoder(w.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Equal(t, 0, result.Waiting)
	assert.Equal(t, 0, result.Registered)
}

// Test getting happening registrations
func TestGetHappeningRegistrations_Empty(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening, _ := happeningService.HappeningRepo().CreateHappening(ctx, model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	})

	handler := api.GetHappeningRegistrations(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/"+happening.ID+"/registrations", nil)
	req.SetPathValue("id", happening.ID)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var registrations []model.Registration
	err = json.NewDecoder(w.Body).Decode(&registrations)
	assert.NoError(t, err)
	assert.Len(t, registrations, 0)
}

// Test getting happening spot ranges
func TestGetHappeningSpotRanges_Empty(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening, _ := happeningService.HappeningRepo().CreateHappening(ctx, model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	})

	handler := api.GetHappeningSpotRanges(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/"+happening.ID+"/spot-ranges", nil)
	req.SetPathValue("id", happening.ID)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var spotRanges []model.SpotRange
	err = json.NewDecoder(w.Body).Decode(&spotRanges)
	assert.NoError(t, err)
	assert.Len(t, spotRanges, 0)
}

// Test getting happening questions
func TestGetHappeningQuestions_Empty(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	date := time.Now().Add(24 * time.Hour)
	happening, _ := happeningService.HappeningRepo().CreateHappening(ctx, model.Happening{
		Slug:  "test-happening",
		Title: "Test Happening",
		Type:  "event",
		Date:  &date,
	})

	handler := api.GetHappeningQuestions(happeningService)

	req := httptest.NewRequest(http.MethodGet, "/happenings/"+happening.ID+"/questions", nil)
	req.SetPathValue("id", happening.ID)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var questions []model.Question
	err = json.NewDecoder(w.Body).Decode(&questions)
	assert.NoError(t, err)
	assert.Len(t, questions, 0)
}

// Test registering for happening with missing ID
func TestRegisterForHappening_MissingID(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.RegisterForHappening(happeningService)

	req := httptest.NewRequest(http.MethodPost, "/happenings//register", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}

// Test registering for happening with invalid JSON
func TestRegisterForHappening_InvalidJSON(t *testing.T) {
	db, happeningService := setupHappeningTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.RegisterForHappening(happeningService)

	req := httptest.NewRequest(http.MethodPost, "/happenings/happening123/register", bytes.NewReader([]byte("invalid")))
	req.SetPathValue("id", "happening123")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}
