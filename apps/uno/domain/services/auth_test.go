package services_test

import (
	"context"
	"errors"
	"testing"
	"uno/domain/model"
	"uno/domain/ports/mocks"
	"uno/domain/services"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestAuthService_SessionRepo(t *testing.T) {
	mockSessionRepo := mocks.NewSessionRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	authService := services.NewAuthService(mockSessionRepo, mockUserRepo)

	sessionRepo := authService.SessionRepo()
	assert.NotNil(t, sessionRepo, "Expected SessionRepo to be non-nil")
}

func TestAuthService_UserRepo(t *testing.T) {
	mockSessionRepo := mocks.NewSessionRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	authService := services.NewAuthService(mockSessionRepo, mockUserRepo)

	userRepo := authService.UserRepo()
	assert.NotNil(t, userRepo, "Expected UserRepo to be non-nil")
}

func TestAuthService_ValidateToken_Success(t *testing.T) {
	ctx := context.Background()
	token := "valid-token"
	userID := "user123"

	expectedSession := testutil.NewFakeStruct(func(s *model.Session) {
		s.UserID = userID
		s.SessionToken = token
	})

	expectedUser := testutil.NewFakeStruct(func(u *model.User) {
		u.ID = userID
		name := "Test User"
		u.Name = &name
	})

	mockSessionRepo := mocks.NewSessionRepo(t)
	mockSessionRepo.EXPECT().
		GetSessionByToken(mock.Anything, token).
		Return(expectedSession, nil).
		Once()

	mockUserRepo := mocks.NewUserRepo(t)
	mockUserRepo.EXPECT().
		GetUserByID(mock.Anything, userID).
		Return(expectedUser, nil).
		Once()

	authService := services.NewAuthService(mockSessionRepo, mockUserRepo)
	user, session, err := authService.ValidateToken(ctx, token)

	assert.NoError(t, err, "Expected ValidateToken to not return an error")
	assert.Equal(t, userID, user.ID)
	assert.Equal(t, userID, session.UserID)
	assert.Equal(t, token, session.SessionToken)
}

func TestAuthService_ValidateToken_SessionError(t *testing.T) {
	ctx := context.Background()
	token := "invalid-token"
	expectedErr := errors.New("session not found")

	mockSessionRepo := mocks.NewSessionRepo(t)
	mockSessionRepo.EXPECT().
		GetSessionByToken(mock.Anything, token).
		Return(model.Session{}, expectedErr).
		Once()

	mockUserRepo := mocks.NewUserRepo(t)

	authService := services.NewAuthService(mockSessionRepo, mockUserRepo)
	user, session, err := authService.ValidateToken(ctx, token)

	assert.Error(t, err, "Expected ValidateToken to return an error")
	assert.Equal(t, expectedErr, err)
	assert.Equal(t, model.User{}, user)
	assert.Equal(t, model.Session{}, session)
}

func TestAuthService_ValidateToken_UserError(t *testing.T) {
	ctx := context.Background()
	token := "valid-token"
	userID := "user123"

	expectedSession := testutil.NewFakeStruct(func(s *model.Session) {
		s.UserID = userID
		s.SessionToken = token
	})

	expectedErr := errors.New("user not found")

	mockSessionRepo := mocks.NewSessionRepo(t)
	mockSessionRepo.EXPECT().
		GetSessionByToken(mock.Anything, token).
		Return(expectedSession, nil).
		Once()

	mockUserRepo := mocks.NewUserRepo(t)
	mockUserRepo.EXPECT().
		GetUserByID(mock.Anything, userID).
		Return(model.User{}, expectedErr).
		Once()

	authService := services.NewAuthService(mockSessionRepo, mockUserRepo)
	user, session, err := authService.ValidateToken(ctx, token)

	assert.Error(t, err, "Expected ValidateToken to return an error")
	assert.Equal(t, expectedErr, err)
	assert.Equal(t, model.User{}, user)
	assert.Equal(t, model.Session{}, session)
}
