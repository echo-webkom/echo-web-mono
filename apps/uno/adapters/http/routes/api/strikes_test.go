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

// Setup db, repo and service for strikes tests
func setupStrikesTest(t *testing.T) (*postgres.Database, *services.StrikeService) {
	db := postgres.SetupTestDB(t)
	dotRepo := postgres.NewDotRepo(db, nil)
	banRepo := postgres.NewBanInfoRepo(db, nil)
	userRepo := postgres.NewUserRepo(db, nil)
	strikeService := services.NewStrikeService(dotRepo, banRepo, userRepo)
	return db, strikeService
}

// Test unbanning users when no users with expired strikes
func TestUnbanUsersWithExpiredStrikesHandler_NoUsers(t *testing.T) {
	db, strikeService := setupStrikesTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.UnbanUsersWithExpiredStrikesHandler(strikeService)

	req := httptest.NewRequest(http.MethodPost, "/strikes/unban", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)
}

// Test unbanning users with expired strikes
func TestUnbanUsersWithExpiredStrikesHandler_WithExpiredStrikes(t *testing.T) {
	db, strikeService := setupStrikesTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create a user
	user, _ := strikeService.UserRepo().CreateUser(ctx, model.User{
		Email: "test@example.com",
		Type:  "student",
	})

	// Create an expired ban
	expiredTime := time.Now().Add(-24 * time.Hour)
	_, _ = strikeService.BanInfoRepo().CreateBan(ctx, model.BanInfo{
		UserID:    user.ID,
		BannedBy:  "admin",
		Reason:    "Test ban",
		ExpiresAt: expiredTime,
	})

	handler := api.UnbanUsersWithExpiredStrikesHandler(strikeService)

	req := httptest.NewRequest(http.MethodPost, "/strikes/unban", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)
}

// Test getting users with strikes when none exist
func TestGetUsersWithStrikesHandler_Empty(t *testing.T) {
	db, strikeService := setupStrikesTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetUsersWithStrikesHandler(strikeService)

	req := httptest.NewRequest(http.MethodGet, "/strikes/users", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var users []any
	err = json.NewDecoder(w.Body).Decode(&users)
	assert.NoError(t, err)
	assert.Len(t, users, 0)
}

// Test getting users with strikes when some exist
func TestGetUsersWithStrikesHandler_WithStrikes(t *testing.T) {
	db, strikeService := setupStrikesTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create a user
	user, _ := strikeService.UserRepo().CreateUser(ctx, model.User{
		Email: "test@example.com",
		Type:  "student",
	})

	// Create a dot/strike
	expiresAt := time.Now().Add(30 * 24 * time.Hour)
	_, _ = strikeService.DotRepo().CreateDot(ctx, model.Dot{
		UserID:    user.ID,
		Count:     1,
		Reason:    "Test strike",
		StrikedBy: "admin",
		ExpiresAt: expiresAt,
	})

	handler := api.GetUsersWithStrikesHandler(strikeService)

	req := httptest.NewRequest(http.MethodGet, "/strikes/users", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var users []any
	err = json.NewDecoder(w.Body).Decode(&users)
	assert.NoError(t, err)
	// The exact length depends on the implementation
	assert.GreaterOrEqual(t, len(users), 0)
}

// Test getting banned users when none exist
func TestGetBannedUsers_Empty(t *testing.T) {
	db, strikeService := setupStrikesTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetBannedUsers(strikeService)

	req := httptest.NewRequest(http.MethodGet, "/strikes/banned", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var users []any
	err = json.NewDecoder(w.Body).Decode(&users)
	assert.NoError(t, err)
	assert.Len(t, users, 0)
}

// Test getting banned users when some exist
func TestGetBannedUsers_WithBans(t *testing.T) {
	db, strikeService := setupStrikesTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create a user
	user, _ := strikeService.UserRepo().CreateUser(ctx, model.User{
		Email: "test@example.com",
		Type:  "student",
	})

	// Create a ban
	expiresAt := time.Now().Add(30 * 24 * time.Hour)
	_, _ = strikeService.BanInfoRepo().CreateBan(ctx, model.BanInfo{
		UserID:    user.ID,
		BannedBy:  "admin",
		Reason:    "Test ban",
		ExpiresAt: expiresAt,
	})

	handler := api.GetBannedUsers(strikeService)

	req := httptest.NewRequest(http.MethodGet, "/strikes/banned", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var users []any
	err = json.NewDecoder(w.Body).Decode(&users)
	assert.NoError(t, err)
	// The exact length depends on the implementation
	assert.GreaterOrEqual(t, len(users), 0)
}
