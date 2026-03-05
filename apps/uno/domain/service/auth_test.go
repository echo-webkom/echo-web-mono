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

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

const testSecret = "test-secret-key"

func createTestJWT(sessionToken string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sessionId": sessionToken,
		"exp":       time.Now().Add(30 * 24 * time.Hour).Unix(),
	})
	signed, _ := token.SignedString([]byte(testSecret))
	return signed
}

func TestAuthService_SessionRepo(t *testing.T) {
	mockSessionRepo := mocks.NewSessionRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, testSecret)

	sessionRepo := authService.SessionRepo()
	assert.NotNil(t, sessionRepo, "Expected SessionRepo to be non-nil")
}

func TestAuthService_UserRepo(t *testing.T) {
	mockSessionRepo := mocks.NewSessionRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)
	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, testSecret)

	userRepo := authService.UserRepo()
	assert.NotNil(t, userRepo, "Expected UserRepo to be non-nil")
}

func TestAuthService_ValidateToken_Success(t *testing.T) {
	ctx := context.Background()
	token := "valid-token"
	jwtToken := createTestJWT(token)
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

	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, testSecret)
	user, session, err := authService.ValidateToken(ctx, jwtToken)

	assert.NoError(t, err, "Expected ValidateToken to not return an error")
	assert.Equal(t, userID, user.ID)
	assert.Equal(t, userID, session.UserID)
	assert.Equal(t, token, session.SessionToken)
}

func TestAuthService_ValidateToken_InvalidJWT(t *testing.T) {
	ctx := context.Background()

	mockSessionRepo := mocks.NewSessionRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)

	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, testSecret)
	user, session, err := authService.ValidateToken(ctx, "not-a-jwt")

	assert.Error(t, err, "Expected ValidateToken to return an error")
	assert.Equal(t, model.User{}, user)
	assert.Equal(t, model.Session{}, session)
}

func TestAuthService_ValidateToken_WrongSecret(t *testing.T) {
	ctx := context.Background()

	// Create JWT with a different secret
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sessionId": "some-session",
		"exp":       time.Now().Add(time.Hour).Unix(),
	})
	signed, _ := token.SignedString([]byte("wrong-secret"))

	mockSessionRepo := mocks.NewSessionRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)

	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, testSecret)
	user, session, err := authService.ValidateToken(ctx, signed)

	assert.Error(t, err, "Expected ValidateToken to return an error")
	assert.Equal(t, model.User{}, user)
	assert.Equal(t, model.Session{}, session)
}

func TestAuthService_ValidateToken_SessionError(t *testing.T) {
	ctx := context.Background()
	token := "invalid-token"
	jwtToken := createTestJWT(token)
	expectedErr := errors.New("session not found")

	mockSessionRepo := mocks.NewSessionRepo(t)
	mockSessionRepo.EXPECT().
		GetSessionByToken(mock.Anything, token).
		Return(model.Session{}, expectedErr).
		Once()

	mockUserRepo := mocks.NewUserRepo(t)

	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, testSecret)
	user, session, err := authService.ValidateToken(ctx, jwtToken)

	assert.Error(t, err, "Expected ValidateToken to return an error")
	assert.Equal(t, expectedErr, err)
	assert.Equal(t, model.User{}, user)
	assert.Equal(t, model.Session{}, session)
}

func TestAuthService_ValidateToken_UserError(t *testing.T) {
	ctx := context.Background()
	token := "valid-token"
	jwtToken := createTestJWT(token)
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

	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, testSecret)
	user, session, err := authService.ValidateToken(ctx, jwtToken)

	assert.Error(t, err, "Expected ValidateToken to return an error")
	assert.Equal(t, expectedErr, err)
	assert.Equal(t, model.User{}, user)
	assert.Equal(t, model.Session{}, session)
}

func TestAuthService_DecodeSessionJWT_ExpiredToken(t *testing.T) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sessionId": "some-session",
		"exp":       time.Now().Add(-time.Hour).Unix(),
	})
	signed, _ := token.SignedString([]byte(testSecret))

	mockSessionRepo := mocks.NewSessionRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)

	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, testSecret)
	_, err := authService.DecodeSessionJWT(signed)

	assert.Error(t, err, "Expected expired JWT to return an error")
}

func TestAuthService_DecodeSessionJWT_NoSecret(t *testing.T) {
	mockSessionRepo := mocks.NewSessionRepo(t)
	mockUserRepo := mocks.NewUserRepo(t)

	authService := service.NewAuthService(mockSessionRepo, mockUserRepo, "")
	_, err := authService.DecodeSessionJWT("some-token")

	assert.Error(t, err, "Expected error when auth secret is not configured")
}
