package service_test

import (
	"context"
	"errors"
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUserService_GetAllUsers(t *testing.T) {
	mockRepo := mocks.NewUserRepo(t)
	mockProfilePictureStore := mocks.NewProfilePictureRepo(t)
	userService := service.NewUserService(mockRepo, mockProfilePictureStore)

	expectedUsers := []model.User{testutil.NewFakeStruct[model.User]()}
	mockRepo.EXPECT().GetAllUsers(mock.Anything).Return(expectedUsers, nil).Once()

	users, err := userService.GetAllUsers(t.Context())
	assert.NoError(t, err)
	assert.Equal(t, expectedUsers, users)
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

	mockProfilePictureStore := mocks.NewProfilePictureRepo(t)
	userService := service.NewUserService(mockRepo, mockProfilePictureStore)
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

	mockProfilePictureStore := mocks.NewProfilePictureRepo(t)
	userService := service.NewUserService(mockRepo, mockProfilePictureStore)
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

	mockProfilePictureStore := mocks.NewProfilePictureRepo(t)
	userService := service.NewUserService(mockRepo, mockProfilePictureStore)
	users, err := userService.GetUsersWithBirthdayToday(ctx)

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, users)
}
