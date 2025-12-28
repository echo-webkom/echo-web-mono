package api_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/services"
	"uno/infrastructure/postgres"

	"github.com/stretchr/testify/assert"
)

// Setup db, repo and service for whitelist tests
func setupWhitelistTest(t *testing.T) (*postgres.Database, *services.WhitelistService) {
	db := postgres.SetupTestDB(t)
	whitelistRepo := postgres.NewWhitelistRepo(db, nil)
	whitelistService := services.NewWhitelistService(whitelistRepo)
	return db, whitelistService
}

// Test getting whitelist when none exist
func TestGetWhitelistHandler_Empty(t *testing.T) {
	db, whitelistService := setupWhitelistTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetWhitelistHandler(nil, whitelistService)

	req := httptest.NewRequest(http.MethodGet, "/whitelist", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var whitelist []model.Whitelist
	err = json.NewDecoder(w.Body).Decode(&whitelist)
	assert.NoError(t, err)
	assert.Len(t, whitelist, 0)
}

// Test getting whitelist when some exist
func TestGetWhitelistHandler_WithData(t *testing.T) {
	db, whitelistService := setupWhitelistTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	_, _ = whitelistService.WhitelistRepo().CreateWhitelist(ctx, model.Whitelist{
		Email:     "test1@example.com",
		Reason:    "Test reason 1",
		ExpiresAt: time.Now().Add(24 * time.Hour),
	})
	_, _ = whitelistService.WhitelistRepo().CreateWhitelist(ctx, model.Whitelist{
		Email:     "test2@example.com",
		Reason:    "Test reason 2",
		ExpiresAt: time.Now().Add(48 * time.Hour),
	})

	handler := api.GetWhitelistHandler(nil, whitelistService)

	req := httptest.NewRequest(http.MethodGet, "/whitelist", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var whitelist []model.Whitelist
	err = json.NewDecoder(w.Body).Decode(&whitelist)
	assert.NoError(t, err)
	assert.Len(t, whitelist, 2)

	emails := []string{whitelist[0].Email, whitelist[1].Email}
	assert.Contains(t, emails, "test1@example.com")
	assert.Contains(t, emails, "test2@example.com")
}

// Test getting whitelist by email success
func TestGetWhitelistByEmailHandler_Success(t *testing.T) {
	db, whitelistService := setupWhitelistTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	_, _ = whitelistService.WhitelistRepo().CreateWhitelist(ctx, model.Whitelist{
		Email:     "test@example.com",
		Reason:    "Test reason",
		ExpiresAt: time.Now().Add(24 * time.Hour),
	})

	handler := api.GetWhitelistByEmailHandler(nil, whitelistService)

	req := httptest.NewRequest(http.MethodGet, "/whitelist/test@example.com", nil)
	req.SetPathValue("email", "test@example.com")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var result model.Whitelist
	err = json.NewDecoder(w.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Equal(t, "test@example.com", result.Email)
	assert.Equal(t, "Test reason", result.Reason)
}

// Test getting whitelist by email not found
func TestGetWhitelistByEmailHandler_NotFound(t *testing.T) {
	db, whitelistService := setupWhitelistTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetWhitelistByEmailHandler(nil, whitelistService)

	req := httptest.NewRequest(http.MethodGet, "/whitelist/notfound@example.com", nil)
	req.SetPathValue("email", "notfound@example.com")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusInternalServerError, status)
}
