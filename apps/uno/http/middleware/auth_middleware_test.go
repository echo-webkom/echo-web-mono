package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/middleware"

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

// Test that it rejects requests with missing or invalid admin API key
func TestAdminMiddleware_Unauthorized(t *testing.T) {
	authService := service.NewAuthService(nil, nil, testSecret)
	adminKey := "some-secret-key"

	middleware := middleware.NewAdminMiddleware(authService, adminKey)

	h := middleware(handler.Handler(func(ctx *handler.Context) error {
		return ctx.Ok()
	}))

	r := httptest.NewRequest(http.MethodGet, "/some-endpoint", nil)
	w := httptest.NewRecorder()

	// No admin key
	r.Header.Set("X-Admin-Key", "")

	ctx := handler.NewContext(w, r)
	h.ServeHTTP(ctx, ctx.R)
	assert.Equal(t, 401, ctx.Status())
}

// Test that it allows requests with valid admin API key
func TestAdminMiddleware_Authorized(t *testing.T) {
	authService := service.NewAuthService(nil, nil, testSecret)
	adminKey := "some-secret-key"

	middleware := middleware.NewAdminMiddleware(authService, adminKey)

	h := middleware(handler.Handler(func(ctx *handler.Context) error {
		return ctx.Ok()
	}))

	r := httptest.NewRequest(http.MethodGet, "/some-endpoint", nil)
	w := httptest.NewRecorder()

	// Valid admin key
	r.Header.Set("X-Admin-Key", adminKey)

	ctx := handler.NewContext(w, r)
	h.ServeHTTP(ctx, ctx.R)
	err := ctx.GetError()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	assert.Equal(t, 200, ctx.Status())
}

// Test that it allows requests with webkom user session token
func TestAdminMiddleware_WebkomUser(t *testing.T) {
	userRepo := mocks.NewUserRepo(t)
	sessionRepo := mocks.NewSessionRepo(t)
	authService := service.NewAuthService(sessionRepo, userRepo, testSecret)

	// Mock a valid session for a webkom user
	userRepo.On("GetUserByID", mock.Anything, "user-123").Return(model.User{
		ID: "user-123",
	}, nil)

	userRepo.On("GetUserMemberships", mock.Anything, "user-123").Return([]string{
		"webkom",
	}, nil)

	sessionRepo.On("GetSessionByToken", mock.Anything, "valid-token").Return(model.Session{
		UserID: "user-123",
	}, nil)

	middleware := middleware.NewAdminMiddleware(authService, "")

	h := middleware(handler.Handler(func(ctx *handler.Context) error {
		return ctx.Ok()
	}))

	r := httptest.NewRequest(http.MethodGet, "/some-endpoint", nil)
	w := httptest.NewRecorder()

	r.Header.Set("Authorization", "Bearer "+createTestJWT("valid-token"))

	ctx := handler.NewContext(w, r)
	h.ServeHTTP(ctx, ctx.R)
	err := ctx.GetError()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	assert.Equal(t, 200, ctx.Status())
}
