package services_test

import (
	"context"
	"errors"
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/ports/mocks"
	"uno/domain/services"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUserService_UserRepo(t *testing.T) {
	mockRepo := mocks.NewUserRepo(t)
	userService := services.NewUserService(mockRepo)

	userRepo := userService.UserRepo()
	assert.NotNil(t, userRepo, "Expected UserRepo to be non-nil")
}

func TestUserService_GetUsersWithBirthdayToday_Success(t *testing.T) {
	ctx := context.Background()

	name1 := "Alice"
	name2 := "Bob"
	expectedUsers := []model.User{
		{
			ID:    "user-1",
			Name:  &name1,
			Email: "alice@example.com",
			Type:  "student",
		},
		{
			ID:    "user-2",
			Name:  &name2,
			Email: "bob@example.com",
			Type:  "student",
		},
	}

	mockRepo := mocks.NewUserRepo(t)
	mockRepo.EXPECT().
		GetUsersWithBirthday(mock.Anything, mock.MatchedBy(func(date time.Time) bool {
			return date.Location().String() == "Europe/Oslo"
		})).
		Return(expectedUsers, nil).
		Once()

	userService := services.NewUserService(mockRepo)
	users, err := userService.GetUsersWithBirthdayToday(ctx)

	assert.NoError(t, err)
	assert.Len(t, users, 2)
	assert.Equal(t, "Alice", *users[0].Name)
	assert.Equal(t, "Bob", *users[1].Name)
}

func TestUserService_GetUsersWithBirthdayToday_Empty(t *testing.T) {
	ctx := context.Background()

	mockRepo := mocks.NewUserRepo(t)
	mockRepo.EXPECT().
		GetUsersWithBirthday(mock.Anything, mock.Anything).
		Return([]model.User{}, nil).
		Once()

	userService := services.NewUserService(mockRepo)
	users, err := userService.GetUsersWithBirthdayToday(ctx)

	assert.NoError(t, err)
	assert.Empty(t, users)
}

func TestUserService_GetUsersWithBirthdayToday_Error(t *testing.T) {
	ctx := context.Background()
	expectedErr := errors.New("database connection failed")

	mockRepo := mocks.NewUserRepo(t)
	mockRepo.EXPECT().
		GetUsersWithBirthday(mock.Anything, mock.Anything).
		Return(nil, expectedErr).
		Once()

	userService := services.NewUserService(mockRepo)
	users, err := userService.GetUsersWithBirthdayToday(ctx)

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, users)
}
