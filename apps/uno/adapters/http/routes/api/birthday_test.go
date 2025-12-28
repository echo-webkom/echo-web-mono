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

// Setup db, repo and service for birthday tests
func setupBirthdayTest(t *testing.T) (*postgres.Database, *services.UserService) {
	db := postgres.SetupTestDB(t)
	userRepo := postgres.NewUserRepo(db, nil)
	userService := services.NewUserService(userRepo)
	return db, userService
}

// Test getting birthdays when none today
func TestBirthdaysTodayHandler_Empty(t *testing.T) {
	db, userService := setupBirthdayTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create user with birthday not today
	yesterday := time.Now().AddDate(0, 0, -1)
	name := "Test User"
	_, _ = userService.UserRepo().CreateUser(ctx, model.User{
		Email:    "test@example.com",
		Name:     &name,
		Type:     "student",
		Birthday: &yesterday,
	})

	handler := api.BirthdaysTodayHandler(nil, userService)

	req := httptest.NewRequest(http.MethodGet, "/birthdays", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var names []string
	err = json.NewDecoder(w.Body).Decode(&names)
	assert.NoError(t, err)
	assert.Len(t, names, 0)
}

// Test getting birthdays when some users have birthday today
func TestBirthdaysTodayHandler_WithBirthdays(t *testing.T) {
	db, userService := setupBirthdayTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create users with birthday today (same month and day, different year)
	today := time.Now()
	birthdayToday := time.Date(1995, today.Month(), today.Day(), 0, 0, 0, 0, time.UTC)
	name1 := "Alice"
	name2 := "Bob"

	_, _ = userService.UserRepo().CreateUser(ctx, model.User{
		Email:    "alice@example.com",
		Name:     &name1,
		Type:     "student",
		Birthday: &birthdayToday,
	})

	birthdayToday2 := time.Date(1998, today.Month(), today.Day(), 0, 0, 0, 0, time.UTC)
	_, _ = userService.UserRepo().CreateUser(ctx, model.User{
		Email:    "bob@example.com",
		Name:     &name2,
		Type:     "student",
		Birthday: &birthdayToday2,
	})

	// Create user with birthday not today
	notToday := time.Date(1997, today.Month()+1, 15, 0, 0, 0, 0, time.UTC)
	name3 := "Charlie"
	_, _ = userService.UserRepo().CreateUser(ctx, model.User{
		Email:    "charlie@example.com",
		Name:     &name3,
		Type:     "student",
		Birthday: &notToday,
	})

	handler := api.BirthdaysTodayHandler(nil, userService)

	req := httptest.NewRequest(http.MethodGet, "/birthdays", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var names []string
	err = json.NewDecoder(w.Body).Decode(&names)
	assert.NoError(t, err)
	assert.Len(t, names, 2)
	assert.Contains(t, names, "Alice")
	assert.Contains(t, names, "Bob")
}

// Test getting birthdays when users have no name
func TestBirthdaysTodayHandler_NoNames(t *testing.T) {
	db, userService := setupBirthdayTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	// Create user with birthday today but no name
	today := time.Now()
	birthdayToday := time.Date(1995, today.Month(), today.Day(), 0, 0, 0, 0, time.UTC)

	_, _ = userService.UserRepo().CreateUser(ctx, model.User{
		Email:    "noname@example.com",
		Type:     "student",
		Birthday: &birthdayToday,
	})

	handler := api.BirthdaysTodayHandler(nil, userService)

	req := httptest.NewRequest(http.MethodGet, "/birthdays", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var names []string
	err = json.NewDecoder(w.Body).Decode(&names)
	assert.NoError(t, err)
	assert.Len(t, names, 0)
}
