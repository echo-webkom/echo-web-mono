package service_test

import (
	"context"
	"errors"
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/ports/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUserService_UserRepo(t *testing.T) {
	mockRepo := mocks.NewUserRepo(t)
	userService := service.NewUserService(mockRepo)

	userRepo := userService.UserRepo()
	assert.NotNil(t, userRepo, "Expected UserRepo to be non-nil")
}

func TestUserService_GetUsersWithBirthdayToday_Success(t *testing.T) {
	ctx := context.Background()

	name1 := "Alice"
	name2 := "Bob"
	expectedUsers := []model.User{
		testutil.NewFakeStruct(func(u *model.User) {
			u.Name = &name1
		}),
		testutil.NewFakeStruct(func(u *model.User) {
			u.Name = &name2
		}),
	}

	mockRepo := mocks.NewUserRepo(t)
	mockRepo.EXPECT().
		GetUsersWithBirthday(mock.Anything, mock.MatchedBy(func(date time.Time) bool {
			return date.Location().String() == "Europe/Oslo"
		})).
		Return(expectedUsers, nil).
		Once()

	userService := service.NewUserService(mockRepo)
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

	userService := service.NewUserService(mockRepo)
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

	userService := service.NewUserService(mockRepo)
	users, err := userService.GetUsersWithBirthdayToday(ctx)

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, users)
}
