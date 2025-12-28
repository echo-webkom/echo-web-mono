package services_test

import (
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/services"
	"uno/infrastructure/postgres"

	"github.com/stretchr/testify/assert"
)

func setupUserServiceTest(t *testing.T) *services.UserService {
	db := postgres.SetupTestDB(t)
	userRepo := postgres.NewUserRepo(db, nil)
	userService := services.NewUserService(userRepo)
	return userService
}

func TestUserService_GetUserRepo(t *testing.T) {
	userService := setupUserServiceTest(t)

	userRepo := userService.UserRepo()
	if userRepo == nil {
		t.Errorf("Expected UserRepo to be non-nil")
	}
}

func TestUserService_GetUsersWithBirthdayToday(t *testing.T) {
	userService := setupUserServiceTest(t)
	ctx := t.Context()

	name := "test"
	birthday := time.Now()
	_, _ = userService.UserRepo().CreateUser(ctx, model.User{
		Email:    "test@example.com",
		Name:     &name,
		Type:     "student",
		Birthday: &birthday,
	})
	name2 := "test2"
	birthday2 := time.Now().AddDate(0, 0, -3) // Not today
	_, _ = userService.UserRepo().CreateUser(ctx, model.User{
		Email:    "test2@example.com",
		Name:     &name2,
		Type:     "student",
		Birthday: &birthday2,
	})

	users, err := userService.GetUsersWithBirthdayToday(ctx)
	assert.NoError(t, err)
	assert.Len(t, users, 1)
	assert.Equal(t, "test", *users[0].Name)
}
