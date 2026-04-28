package service_test

import (
	"context"
	"errors"
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/pkg/option"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUserService_GetAllUsers(t *testing.T) {
	mockRepo := mocks.NewUserRepo(t)
	mockProfilePictureStore := mocks.NewProfilePictureRepo(t)
	userService := service.NewUserService(mockRepo, mockProfilePictureStore, nil, nil)

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
	userService := service.NewUserService(mockRepo, mockProfilePictureStore, nil, nil)
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
	userService := service.NewUserService(mockRepo, mockProfilePictureStore, nil, nil)
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
	userService := service.NewUserService(mockRepo, mockProfilePictureStore, nil, nil)
	users, err := userService.GetUsersWithBirthdayToday(ctx)

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, users)
}

func TestUserService_UpdateUser(t *testing.T) {
	validDegreeID := "inf"
	validDegree := testutil.NewFakeStruct(func(d *model.Degree) { d.ID = validDegreeID })

	tests := []struct {
		name          string
		params        port.UpdateUserParams
		setupMocks    func(*mocks.UserRepo, *mocks.DegreeRepo)
		nilDegreeRepo bool
		expectedErr   error
	}{
		{
			name: "success — valid email, degree, and year",
			params: port.UpdateUserParams{
				AlternativeEmail: option.New(new("valid@example.com")),
				DegreeID:         option.New(new(validDegreeID)),
				Year:             option.New(new(3)),
			},
			setupMocks: func(userRepo *mocks.UserRepo, degreeRepo *mocks.DegreeRepo) {
				degreeRepo.EXPECT().
					GetAllDegrees(mock.Anything).
					Return([]model.Degree{validDegree}, nil).
					Once()
				userRepo.EXPECT().
					UpdateUser(mock.Anything, "user-1", mock.Anything).
					Return(testutil.NewFakeStruct[model.User](), nil).
					Once()
			},
		},
		{
			name: "invalid email",
			params: port.UpdateUserParams{
				AlternativeEmail: option.New(strPtr("not-an-email")),
			},
			setupMocks:  func(*mocks.UserRepo, *mocks.DegreeRepo) {},
			expectedErr: service.ErrInvalidEmail,
		},
		{
			name: "nil email skips validation",
			params: port.UpdateUserParams{
				AlternativeEmail: option.New[*string](nil),
				Year:             option.New(new(2)),
			},
			setupMocks: func(userRepo *mocks.UserRepo, _ *mocks.DegreeRepo) {
				userRepo.EXPECT().
					UpdateUser(mock.Anything, "user-1", mock.Anything).
					Return(testutil.NewFakeStruct[model.User](), nil).
					Once()
			},
		},
		{
			name: "absent email skips validation",
			params: port.UpdateUserParams{
				Year: option.New(new(1)),
			},
			setupMocks: func(userRepo *mocks.UserRepo, _ *mocks.DegreeRepo) {
				userRepo.EXPECT().
					UpdateUser(mock.Anything, "user-1", mock.Anything).
					Return(testutil.NewFakeStruct[model.User](), nil).
					Once()
			},
		},
		{
			name: "invalid year",
			params: port.UpdateUserParams{
				Year: option.New(new(0)),
			},
			setupMocks:  func(*mocks.UserRepo, *mocks.DegreeRepo) {},
			expectedErr: service.ErrInvalidYear,
		},
		{
			name: "valid year passes through",
			params: port.UpdateUserParams{
				Year: option.New(new(6)),
			},
			setupMocks: func(userRepo *mocks.UserRepo, _ *mocks.DegreeRepo) {
				userRepo.EXPECT().
					UpdateUser(mock.Anything, "user-1", mock.Anything).
					Return(testutil.NewFakeStruct[model.User](), nil).
					Once()
			},
		},
		{
			name: "degree not in list",
			params: port.UpdateUserParams{
				DegreeID: option.New(strPtr("unknown-degree")),
			},
			setupMocks: func(_ *mocks.UserRepo, degreeRepo *mocks.DegreeRepo) {
				degreeRepo.EXPECT().
					GetAllDegrees(mock.Anything).
					Return([]model.Degree{validDegree}, nil).
					Once()
			},
			expectedErr: service.ErrDegreeNotFound,
		},
		{
			name: "nil degreeRepo skips degree validation",
			params: port.UpdateUserParams{
				DegreeID: option.New(strPtr("any-id")),
			},
			nilDegreeRepo: true,
			setupMocks: func(userRepo *mocks.UserRepo, _ *mocks.DegreeRepo) {
				userRepo.EXPECT().
					UpdateUser(mock.Anything, "user-1", mock.Anything).
					Return(testutil.NewFakeStruct[model.User](), nil).
					Once()
			},
		},
		{
			name: "repo error propagated",
			params: port.UpdateUserParams{
				Year: option.New(new(2)),
			},
			setupMocks: func(userRepo *mocks.UserRepo, _ *mocks.DegreeRepo) {
				userRepo.EXPECT().
					UpdateUser(mock.Anything, "user-1", mock.Anything).
					Return(model.User{}, errors.New("db failure")).
					Once()
			},
			expectedErr: errors.New("db failure"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUserRepo := mocks.NewUserRepo(t)
			mockDegreeRepo := mocks.NewDegreeRepo(t)
			tt.setupMocks(mockUserRepo, mockDegreeRepo)

			var userService *service.UserService
			if tt.nilDegreeRepo {
				userService = service.NewUserService(mockUserRepo, nil, nil, nil)
			} else {
				userService = service.NewUserService(mockUserRepo, nil, nil, mockDegreeRepo)
			}

			_, err := userService.UpdateUser(context.Background(), "user-1", tt.params)

			if tt.expectedErr != nil {
				assert.ErrorContains(t, err, tt.expectedErr.Error())
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
